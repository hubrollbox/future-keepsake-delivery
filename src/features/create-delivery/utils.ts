
export const isValidFile = (file: File) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "video/mp4",
    "video/quicktime",
    "audio/mpeg"
  ];
  const maxSizeMB = 20;
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Só são aceites PDF, DOC, JPG, PNG, MP4, MOV, MP3." };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `O ficheiro não pode exceder ${maxSizeMB}MB.` };
  }
  return { valid: true, error: "" };
};

export const isValidFutureDate = (dateString: string, timeString: string) => {
  const deliveryDateTime = new Date(`${dateString}T${timeString}`);
  const now = new Date();
  return deliveryDateTime > now;
};

export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

