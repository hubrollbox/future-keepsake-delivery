
-- Insert test keepsake with future delivery date (to pass check constraint)
INSERT INTO keepsakes (user_id, title, message, message_content, message_type, type, status, delivery_date)
VALUES (
  'f77502de-270f-43fb-b43e-f88dc37b92e2',
  'Teste Envio Keepla.pt',
  'Esta é uma mensagem de teste para verificar o envio de email via Resend com o domínio keepla.pt. Olá Bruno! 🎉',
  'Esta é uma mensagem de teste para verificar o envio de email via Resend com o domínio keepla.pt. Olá Bruno! 🎉',
  'keepsake',
  'digital',
  'pending',
  (NOW() + INTERVAL '1 minute')
);

-- Insert recipient for the test keepsake
INSERT INTO recipients (keepsake_id, name, email, delivery_channel, relationship)
VALUES (
  (SELECT id FROM keepsakes WHERE title = 'Teste Envio Keepla.pt' AND user_id = 'f77502de-270f-43fb-b43e-f88dc37b92e2' ORDER BY created_at DESC LIMIT 1),
  'Bruno Teste',
  'brunopinto@rollbox.pt',
  'email',
  'self'
);
