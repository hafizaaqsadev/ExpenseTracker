import React from "react";

function Footer() {
  return (
    <footer
      className="mt-5 pt-4 pb-3 text-center"
      style={{
        backgroundColor: "#00796b",
        color: "white",
        fontSize: "0.9rem",
      }}
    >
      {/* Top Links */}
      <div className="mb-2 d-flex justify-content-center flex-wrap gap-3">
        {[
          { name: "Privacy Policy", href: "/privacy-policy" },
          { name: "Terms of Service", href: "/terms-of-service" },
          { name: "Contact Us", href: "/contact" },
        ].map((link) => (
          <a
            key={link.name}
            href={link.href}
            style={{ color: "white", textDecoration: "none" }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* Social Icons */}
      <div className="mb-2">
        {["facebook", "twitter", "instagram", "linkedin"].map((platform) => (
          <a
            key={platform}
            href={`https://${platform}.com`}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "white",
              margin: "0 10px",
              fontSize: "1.2rem",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <i className={`fab fa-${platform}`}></i>
          </a>
        ))}
      </div>

      {/* Copyright & Made With */}
      <div className="mt-1">© 2025 Daily Expense Tracker. All rights reserved.</div>
      <div className="mt-1">
        Made with <span style={{ color: "red" }}>❤️</span> by Hafiza Aqsa
      </div>
    </footer>
  );
}

export default Footer;
