import { useSelector, shallowEqual } from "react-redux"

export default function Home () {  
  
  const users: readonly IUser[] = useSelector(
    (state: UserState) => state.users,
    shallowEqual
  );

    console.log('users: ', users);

  return (    
    <h2>Home </h2>
  )
}