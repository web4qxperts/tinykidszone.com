import Wrapper from "../components/wrapper";

export default function ContactUs() {
    return <Wrapper>
    <main>
    <div id="main" className="container">
    
    <div id="home">
    <div className="content">
     
    <section id="contact"> 
    <h1>Contact Us</h1>
    <div className="contWrap">
    <div className="contactForm">
                <h2>Connect with us</h2>
                
                    <input type="hidden" name="secret" value="" />
    
                    <div className="fields-wrap">
                        <div className="field-row">
                            <label>Full Name*</label>
                            <div><input type="text" id="name" name="1" placeholder="First Name*" required /></div>
                        </div>
                        <div className="field-row">
                            <label>Email Address*</label>
                            <div><input type="email" id="email" name="7" placeholder="Email Address*" required /></div>
                        </div>
                        <div className="field-row">
                            <label>Phone</label>
                            <div><input type="tel" id="phone" name="4" placeholder="Phone" /></div>
                        </div>
                      
                        <div className="field-row">
                            <label>Additional Comments</label>
                            <div><textarea name="5217" id="message" placeholder="Additional Comments" ></textarea></div>
                        </div>
                    </div>
                    <div className="st-submit"><input type="submit" value="Submit" onclick="postForm()" /></div>
            </div>
    </div>
    </section>
      
    </div>
    <div className="botbg"><img src="images/home-bot-bg-v1.png" /></div>
    </div>
    </div>
    </main>
    
    </Wrapper>
    
}

