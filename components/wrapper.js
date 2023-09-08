export default function Wrapper(props) {
    return <div id="root">
    <header>
    <div className="logo animate__animated animate__swing animate__delay-2s"><a href="/"><img src="/images/tkz-logo.png" /></a></div>
    
    <div className="menuIcon">
    <div className="iconOpenMenu"></div>
    <div className="iconCloseMenu"></div>
    </div>
    
    <div className="sideMenu disNone767">
    <a href="" title="Refresh" id="pageReload">
    <span>
    <span>
   
    </span></span></a>
    
    <a href="#" title="Full Screen" id="btnFullScreen">
    <span>
    <span>
    </span></span></a>
    
    <a href="/about-us" title="About Us">
    <span>
    <span>
    </span></span></a>
    
    <a href="/contact-us" title="Contact Us">
    <span>
    <span>
    </span></span></a></div>
    
    </header>
    {props.children}
    </div>
}