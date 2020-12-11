import { Socket } from "socket.io-client"

interface Props {
  socket: typeof Socket
  testString: string
}

export default function Home (props: Props) {  
  
  console.log('props from Home component: ', props);
  return (    
    <h2>Home </h2>
  )
}