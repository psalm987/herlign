import Script from "next/script";

const RawForm = () => {
  return (
    <div>
      <Script
        src="https://f.convertkit.com/ckjs/ck.5.js"
        strategy="lazyOnload"
      />
      <form
        action="https://app.kit.com/forms/8934032/subscriptions"
        className="seva-form formkit-form"
        method="post"
        data-sv-form="8934032"
        data-uid="76f84a4cff"
        data-format="inline"
        data-version="5"
        data-options='{"settings":{"after_subscribe":{"action":"message","success_message":"Success! Now check your email to confirm your subscription.","redirect_url":""},"analytics":{"google":null,"fathom":null,"facebook":null,"segment":null,"pinterest":null,"sparkloop":null,"googletagmanager":null},"modal":{"trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"powered_by":{"show":true,"url":"https://kit.com/features/forms?utm_campaign=poweredby&amp;utm_content=form&amp;utm_medium=referral&amp;utm_source=dynamic"},"recaptcha":{"enabled":false},"return_visitor":{"action":"show","custom_content":""},"slide_in":{"display_in":"bottom_right","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"sticky_bar":{"display_in":"top","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15}},"version":"5"}'
        min-width="400 500 600 700 800"
      >
        <div data-style="image">
          <div
            data-element="column"
            className="formkit-column"
            style={{ backgroundColor: "rgb(236, 102, 28)", height: "480px" }}
          >
            <div className="formkit-background" style={{ opacity: 0 }}></div>
            <div
              className="formkit-header"
              data-element="header"
              style={{
                color: "rgb(255, 255, 255)",
                fontSize: "36px",
                fontWeight: 700,
              }}
            >
              <h2>Let&apos;s Chat. No, Really.</h2>
            </div>
            <div
              className="formkit-subheader"
              data-element="subheader"
              style={{ color: "rgb(255, 255, 255)", fontSize: "22px" }}
            >
              <p>
                Have a question? Want to suggest a workshop? Just feel like
                saying hi? We&apos;re all ears.
              </p>
            </div>
          </div>
          <div data-element="column" className="formkit-column">
            <ul
              className="formkit-alert formkit-alert-error"
              data-element="errors"
              data-group="alert"
            ></ul>
            <div data-element="fields" className="seva-fields formkit-fields">
              <div className="formkit-field">
                <input
                  className="formkit-input"
                  aria-label="First Name"
                  name="fields[first_name]"
                  required
                  placeholder="First Name"
                  type="text"
                  style={{
                    color: "rgb(77, 77, 77)",
                    borderColor: "rgb(227, 227, 227)",
                    borderRadius: "0px",
                    fontWeight: 400,
                  }}
                />
              </div>
              <div className="formkit-field">
                <input
                  className="formkit-input"
                  name="email_address"
                  aria-label="Email Address"
                  placeholder="Email Address"
                  required
                  type="email"
                  style={{
                    color: "rgb(77, 77, 77)",
                    borderColor: "rgb(227, 227, 227)",
                    borderRadius: "0px",
                    fontWeight: 400,
                  }}
                />
              </div>
              <div className="formkit-field">
                <input
                  className="formkit-input"
                  name="fields[message]"
                  placeholder="Message"
                  required
                  type="text"
                  style={{
                    color: "rgb(77, 77, 77)",
                    borderColor: "rgb(227, 227, 227)",
                    borderRadius: "0px",
                    fontWeight: 400,
                  }}
                />
              </div>
              <button
                data-element="submit"
                className="formkit-submit formkit-submit"
                style={{
                  color: "rgb(255, 255, 255)",
                  backgroundColor: "rgb(236, 102, 28)",
                  borderRadius: "9px",
                  fontWeight: 400,
                }}
              >
                <span className="">Subscribe</span>
              </button>
            </div>
            <div className="formkit-powered-by-convertkit-container">
              <a
                href="https://kit.com/features/forms?utm_campaign=poweredby&amp;utm_content=form&amp;utm_medium=referral&amp;utm_source=dynamic"
                data-element="powered-by"
                className="formkit-powered-by-convertkit"
                data-variant="dark"
                target="_blank"
                rel="nofollow"
              >
                Built with Kit
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RawForm;
