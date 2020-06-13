package br.com.assistencia.util;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class SendMail {

	public static void enviarEmail (String email, String novaSenha) throws MessagingException{

        Properties props = new Properties();
        /** Par�metros de conex�o com servidor Gmail */
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.socketFactory.port", "587");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getDefaultInstance(props,
                    new javax.mail.Authenticator() {
                         protected PasswordAuthentication getPasswordAuthentication() 
                         {
                               return new PasswordAuthentication("sendemailteste2020@gmail.com", "sendemailteste");
                         }
                    });

        /** Ativa Debug para sess�o */
        session.setDebug(true);

        try {
              Message message = new MimeMessage(session);
              message.setFrom(new InternetAddress("sendemailteste@gmail.com")); //Remetente

              Address[] toUser = InternetAddress //Destinatário(s)
                         .parse(email); 
              String messagem = "Olá,\nVocê solicitou a redefinição da senha de acesso.\n\n    Nova Senha:  " + novaSenha;
              messagem += "\n\nPara isso clique no link abaixo e utilize a nova senha:";
              messagem += "\n\nhttp://localhost:8080/Assistencia";

              message.setRecipients(Message.RecipientType.TO, toUser);
              message.setSubject("Nova Senha de Acesso");//Assunto
              message.setText(messagem);
              /**M�todo para enviar a mensagem criada*/
              
              Transport.send(message);

         } catch (MessagingException e) {
              throw new RuntimeException(e);
        }
	}
}
