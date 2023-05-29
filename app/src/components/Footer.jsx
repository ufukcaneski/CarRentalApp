import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark mt-5">
      <div className="mx-auto px-4 py-16">
        <div className="d-flex justify-content-center align-items-end">
          <div>
                      <h1 className="text-3xl text-white font-bold">
                          Ufukcan Eski
                        </h1>
          </div>

          <nav className="mt-12 lg:mt-0">
            <ul className="d-flex flex-wrap justify-content-center gap-6 justify-content-end">
              <li>
                <a
                  className="text-white"
                  href="https://twitter.com/ufukcaneski"
                  target="_blank"
                >
                  Twitter
                </a>
              </li>

              <li>
                <a
                  className="text-white"
                  href="https://www.linkedin.com/in/ufukcaneski/"
                  target="_blank"
                >
                  Linkedin
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;