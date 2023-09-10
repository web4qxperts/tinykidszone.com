import db from "../../components/db";

export const config = {
    runtime: 'experimental-edge',
  }
  
  export default async function (req) {
    if(req.method === "POST") {
      return new Response(
        JSON.stringify({ name: `John Doe ${req.method}` }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }
    else {
      return new Response(
        JSON.stringify({
          status:0,
          message:"method not fond"
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }
    
  }