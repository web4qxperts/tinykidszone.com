import Head from "next/head";

export const GameHead = function ({data}) {
    if(data) {
        return <Head>
        <title>{data.metaTitle}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://www.tinykidszone.com/${data.slug}`}/>
        <meta name="description" content={data.metaDescription} />
        <meta name="keywords" content={data.metaKeywords} />
        <meta property="og:title" content={data.metaTitle} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content={"Tiny Kids Zone"} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:url" content={`https://www.tinykidszone.com/${data.slug}`} />
        <meta property="og:image" content={`https://www.tinykidszone.com/games/icons/${data.slug}.png`}/>
        <meta property="og:image:secure_url" content={`https://www.tinykidszone.com/games/icons/${data.slug}.png`} />
        <link href="/css/game.css" rel="stylesheet"/>
        <link href={`/css/${data.slug}.css`} rel="stylesheet"/>
        </Head>
    }
    return <Head>
    <title>404 - Page not found</title>
    <link href="/css/game.css" rel="stylesheet"/>
    </Head>
}

const pages = {
    "about-us":{
        "title":"About Us",
        "metaTitle":"About Us - Kids Learning Games",
        "slug":"about-us"
    },
    "contact-us":{
        "title":"Contact Us",
        "metaTitle":"Contact Us - Kids Learning Games",
        "slug":"contact-us"
    },
    "home":{
        "title":"Kids Learning Games",
        "metaTitle":"Kids Learning Games",
        "slug":""
    }
}

export const PageHead = function ({slug}) {
    const data = pages[slug];
    return <Head>
    <title>{data.metaTitle}</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="canonical" href={`https://www.tinykidszone.com/${data.slug}`}/>
    <meta name="description" content={data.metaDescription} />
    <meta name="keywords" content={data.metaKeywords} />
    <meta property="og:title" content={data.metaTitle} />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website"/>
    <meta property="og:site_name" content={"Tiny Kids Zone"} />
    <meta property="og:description" content={data.metaDescription} />
    <meta property="og:url" content={`https://www.tinykidszone.com/${data.slug}`} />
    <meta property="og:image" content={`https://www.tinykidszone.com/icons-512.png`}/>
    <meta property="og:image:secure_url" content={`https://www.tinykidszone.com/icons-512.png`} />
    <link href="/css/main.css" rel="stylesheet"/>
    </Head>
}