interface Mail {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export default Mail;
