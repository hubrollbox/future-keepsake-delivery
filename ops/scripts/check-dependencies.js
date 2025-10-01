/**
 * Script para verificação de dependências de segurança
 * Este script utiliza npm audit para verificar vulnerabilidades nas dependências
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuração para compatibilidade com __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cores para output no console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Função para executar comandos shell
function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    return error.stdout.toString();
  }
}

// Função para verificar vulnerabilidades com npm audit
function checkVulnerabilities() {
  console.log(`${colors.blue}Verificando vulnerabilidades nas dependências...${colors.reset}`);
  
  try {
    const auditOutput = runCommand('npm audit --json');
    const auditData = JSON.parse(auditOutput);
    
    // Verificar se há vulnerabilidades
    if (auditData.metadata && auditData.metadata.vulnerabilities) {
      const { critical, high, moderate, low } = auditData.metadata.vulnerabilities;
      
      console.log('\nResumo de vulnerabilidades:');
      console.log(`${colors.red}Críticas: ${critical}${colors.reset}`);
      console.log(`${colors.magenta}Altas: ${high}${colors.reset}`);
      console.log(`${colors.yellow}Moderadas: ${moderate}${colors.reset}`);
      console.log(`${colors.blue}Baixas: ${low}${colors.reset}`);
      
      // Verificar se há vulnerabilidades críticas ou altas
      if (critical > 0 || high > 0) {
        console.log(`\n${colors.red}ATENÇÃO: Foram encontradas vulnerabilidades críticas ou de alta severidade!${colors.reset}`);
        console.log('Execute o comando abaixo para corrigir automaticamente as vulnerabilidades:');
        console.log(`${colors.green}npm audit fix${colors.reset}`);
        console.log('\nPara vulnerabilidades que não podem ser corrigidas automaticamente:');
        console.log(`${colors.green}npm audit fix --force${colors.reset} (Cuidado: pode causar incompatibilidades)`);
        
        // Salvar relatório detalhado
        const reportPath = path.join(__dirname, '..', 'security-audit-report.json');
        fs.writeFileSync(reportPath, auditOutput);
        console.log(`\nRelatório detalhado salvo em: ${reportPath}`);
        
        return false;
      } else if (moderate > 0 || low > 0) {
        console.log(`\n${colors.yellow}Foram encontradas vulnerabilidades de baixa ou média severidade.${colors.reset}`);
        console.log('Considere executar `npm audit fix` para corrigir essas vulnerabilidades.');
      } else {
        console.log(`\n${colors.green}Nenhuma vulnerabilidade encontrada!${colors.reset}`);
      }
    } else {
      console.log(`${colors.green}Nenhuma vulnerabilidade encontrada!${colors.reset}`);
    }
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Erro ao verificar vulnerabilidades:${colors.reset}`, error.message);
    return false;
  }
}

// Função para verificar dependências desatualizadas
function checkOutdatedDependencies() {
  console.log(`\n${colors.blue}Verificando dependências desatualizadas...${colors.reset}`);
  
  try {
    const outdatedOutput = runCommand('npm outdated --json');
    
    // Se não houver dependências desatualizadas, o comando retorna uma string vazia
    if (!outdatedOutput || outdatedOutput.trim() === '') {
      console.log(`${colors.green}Todas as dependências estão atualizadas!${colors.reset}`);
      return true;
    }
    
    const outdatedData = JSON.parse(outdatedOutput);
    const outdatedCount = Object.keys(outdatedData).length;
    
    if (outdatedCount > 0) {
      console.log(`${colors.yellow}Foram encontradas ${outdatedCount} dependências desatualizadas.${colors.reset}`);
      console.log('Execute o comando abaixo para atualizar as dependências:');
      console.log(`${colors.green}npm update${colors.reset}`);
      
      // Listar as 5 dependências mais críticas para atualizar
      const criticalDeps = Object.entries(outdatedData)
        .filter(([, info]) => info.type !== 'devDependencies')
        .sort((a, b) => {
          // Priorizar dependências com maior diferença de versão
          const versionDiffA = a[1].latest.localeCompare(a[1].current);
          const versionDiffB = b[1].latest.localeCompare(b[1].current);
          return versionDiffB - versionDiffA;
        })
        .slice(0, 5);
      
      if (criticalDeps.length > 0) {
        console.log('\nDependências críticas para atualizar:');
        criticalDeps.forEach(([name, info]) => {
          console.log(`${colors.cyan}${name}${colors.reset}: ${info.current} → ${colors.green}${info.latest}${colors.reset}`);
        });
      }
    } else {
      console.log(`${colors.green}Todas as dependências estão atualizadas!${colors.reset}`);
    }
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Erro ao verificar dependências desatualizadas:${colors.reset}`, error.message);
    return false;
  }
}

// Função principal
function main() {
  console.log(`${colors.cyan}=== Verificação de Segurança de Dependências ===${colors.reset}\n`);
  
  const vulnerabilitiesCheck = checkVulnerabilities();
  const outdatedCheck = checkOutdatedDependencies();
  
  if (vulnerabilitiesCheck && outdatedCheck) {
    console.log(`\n${colors.green}✓ Verificação de segurança concluída com sucesso!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.yellow}⚠ Verificação de segurança concluída com avisos.${colors.reset}`);
    process.exit(1);
  }
}

// Executar o script
main();