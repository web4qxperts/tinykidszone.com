import {PageHead} from "./helpers";

import Link from "next/link";

export default function Wrapper(props) {
    return <div id="root">
        <PageHead slug={props.slug} />
    <header>
    <div className="logo animate__animated animate__swing animate__delay-2s"><Link href="/"><img src="/images/tkz-logo.png" /></Link></div>
    
    <div className="menuIcon">
    <div className="iconOpenMenu"></div>
    <div className="iconCloseMenu"></div>
    </div>
    
    <div className="sideMenu disNone767">
    <Link href="" title="Refresh" id="pageReload">
    <span>
    <span>
   
    </span></span></Link>
    
    <Link href="#" title="Full Screen" id="btnFullScreen">
    <span>
    <span>
    </span></span></Link>
    
    <Link href="/about-us" title="About Us">
    <span>
    <span>
    </span></span></Link>
    
    <Link href="/contact-us" title="Contact Us">
    <span>
    <span>
    </span></span></Link></div>
    
    </header>
    {props.children}
    </div>
}