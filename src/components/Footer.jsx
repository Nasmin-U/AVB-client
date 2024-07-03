import "./css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        &copy; {new Date().getFullYear()} Arabic Vocabulary Builder. All rights
        reserved by{" "}
        <a
          href="https://github.com/Nasmin-U"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nasmin-U
        </a>
      </p>
    </footer>
  );
};

export default Footer;
