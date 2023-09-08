import Wrapper from "../components/wrapper";
import db from "../components/db";

export default function Home({data}) {
 console.log(data)
    
    return  <Wrapper>
                
            <main>
            <div id="main" className="container">

            <div id="home">
            <div className="content">
                {
                    data.map(function(v){
                        return   <a className="cta-box animate__animated animate__zoomIn" href={`/${v.data.slug}`} title={v.data.title}>
                            <img src={`/games/icons/${v.data.id}.png`} />
                        <span>{v.data.title}</span>
                        </a>

                    })
                }
            </div>
            <div className="botbg"><img src="/images/home-bot-bg-v1.png" /></div>
            </div>
            </div>
            </main>

        </Wrapper>
}


export async function getStaticProps() {
    const data = await db.getGames();
    return {
      props: {
        data
      },
    };
  }