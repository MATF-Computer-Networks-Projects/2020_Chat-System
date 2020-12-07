import { useSelector, shallowEqual } from "react-redux"

export default function Home () {  
  
  const user: IUser | undefined = useSelector(
    (state: UserState) => state.user,
    shallowEqual
  );

    console.log('users: ', user);

  return (    
    <h2>Home </h2>
  )
}