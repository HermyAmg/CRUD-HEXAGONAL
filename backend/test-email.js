import nodemailer from 'nodemailer';

async function probarEnvio() {
  console.log("Enviando correo de prueba...");

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'constantin.metz9@ethereal.email',
      pass: 'dTTuxrgS7MSKywQRq2'
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"E-Commerce Hexagonal" <no-reply@ecommerce.com>',
      to: 'constantin.metz9@ethereal.email',
      subject: 'Confirmación de Pedido #PEDIDO-12345 - Pendiente de Pago',
      html: `
        <h2>¡Gracias por tu compra!</h2>
        <p>Estado del pedido: <strong>Pendiente de Pago</strong></p>
        <p>Total a pagar: <strong>$850.00 MXN</strong></p>
        <hr/>
        <h3>Instrucciones de Pago:</h3>
        <p>Realiza tu transferencia a la cuenta CLABE: 012345678901234567</p>
      `
    });

    console.log("✅ ¡Correo enviado exitosamente!");
    console.log("ID del mensaje:", info.messageId);
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
  }
}

probarEnvio();