
// File upload security utilities

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
  checkMagicNumbers?: boolean;
  destinationPath?: string; // Added to track where files will be stored
  isPublicUpload?: boolean; // Flag to indicate if file is uploaded to public directory
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

// Magic numbers for common file types (first few bytes)
const MAGIC_NUMBERS: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]  // GIF89a
  ],
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
  'video/mp4': [[0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], [0x00, 0x00, 0x00, 0x1C, 0x66, 0x74, 0x79, 0x70]],
  'audio/mpeg': [[0xFF, 0xFB], [0xFF, 0xF3], [0xFF, 0xF2]],
  'application/zip': [[0x50, 0x4B, 0x03, 0x04], [0x50, 0x4B, 0x05, 0x06], [0x50, 0x4B, 0x07, 0x08]]
};

export const validateFile = async (
  file: File,
  options: FileValidationOptions = {}
): Promise<FileValidationResult> => {
  const errors: string[] = [];
  
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
    checkMagicNumbers = true,
    destinationPath = '',
    isPublicUpload = false
  } = options;

  // Check file size
  if (file.size > maxSize) {
    errors.push(`Ficheiro demasiado grande. Máximo permitido: ${formatFileSize(maxSize)}`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Tipo de ficheiro não permitido. Tipos aceites: ${allowedTypes.join(', ')}`);
  }

  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push(`Extensão de ficheiro não permitida. Extensões aceites: ${allowedExtensions.join(', ')}`);
  }
  
  // Apply stricter validation for public directory uploads
  if (isPublicUpload || destinationPath.includes('/public/') || destinationPath.includes('\\public\\')) {
    // For public directory, only allow image files with specific extensions
    const publicSafeExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
    const publicSafeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    
    if (!publicSafeExtensions.includes(fileExtension)) {
      errors.push(`Ficheiros na pasta pública apenas podem ter as extensões: ${publicSafeExtensions.join(', ')}`);
    }
    
    if (!publicSafeTypes.includes(file.type)) {
      errors.push(`Ficheiros na pasta pública apenas podem ser imagens dos tipos: ${publicSafeTypes.join(', ')}`);
    }
  }

  // Check magic numbers if requested
  if (checkMagicNumbers && MAGIC_NUMBERS[file.type]) {
    const isValidMagicNumber = await validateMagicNumber(file);
    if (!isValidMagicNumber) {
      errors.push('Ficheiro corrompido ou tipo de ficheiro não corresponde ao conteúdo');
    }
  }

  // Check for potentially dangerous file names
  if (isDangerousFileName(file.name)) {
    errors.push('Nome de ficheiro não permitido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateMagicNumber = async (file: File): Promise<boolean> => {
  const magicNumbers = MAGIC_NUMBERS[file.type];
  if (!magicNumbers) return true; // Skip validation if no magic numbers defined

  try {
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    return magicNumbers.some(magicNumber =>
      magicNumber.every((byte, index) => bytes[index] === byte)
    );
  } catch (error) {
    console.error('Error validating magic number:', error);
    return false;
  }
};

const isDangerousFileName = (fileName: string): boolean => {
  const dangerous = [
    // Executable extensions
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.mjs', '.cjs',
    // Script files
    '.sh', '.ps1', '.php', '.asp', '.jsp', '.aspx', '.cshtml', '.py', '.rb',
    // Potentially dangerous web files
    '.html', '.htm', '.xhtml', '.shtml', '.phtml',
    // Archive with potential executables
    '.rar', '.7z',
    // System files
    '.sys', '.dll'
  ];

  const lowerFileName = fileName.toLowerCase();
  return dangerous.some(ext => lowerFileName.endsWith(ext)) ||
         fileName.includes('..') || // Path traversal
         fileName.includes('<') || fileName.includes('>') || // HTML injection
         fileName.length > 255; // Too long filename
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const createSecureFileName = (originalName: string, isPublicUpload: boolean = false): string => {
  // Remove potentially dangerous characters and replace with safe alternatives
  const safeName = originalName
    .replace(/[^\w\s.-]/g, '') // Remove special characters except word chars, spaces, dots, hyphens
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/\.+/g, '.') // Replace multiple dots with single dot
    .toLowerCase();

  // Add timestamp to make filename unique
  const timestamp = Date.now();
  const extension = safeName.split('.').pop();
  const nameWithoutExtension = safeName.split('.').slice(0, -1).join('.');
  
  // Generate a random string for additional security
  const randomString = Math.random().toString(36).substring(2, 10);
  
  // For public uploads, use a more secure naming convention with UUID-like format
  if (isPublicUpload) {
    // Ensure extension is safe for public directory
    const safeExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    const safeExtension = safeExtensions.includes(extension || '') ? extension : 'txt';
    
    return `${randomString}-${timestamp}.${safeExtension}`;
  }
  
  return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
};

/**
 * Validates if a file is safe to be stored in the public directory
 * @param file The file to validate
 * @returns Validation result
 */
export const validatePublicDirectoryFile = async (file: File): Promise<FileValidationResult> => {
  // Stricter validation for public directory
  return validateFile(file, {
    maxSize: 5 * 1024 * 1024, // 5MB max for public files
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
    checkMagicNumbers: true,
    isPublicUpload: true
  });
};
