type userType = {
    user:string
}

const UserLogo = ({user}:userType) => {

  return (
     <div className="userLogo">
            <div className="logo">{user.name[0]}</div>
            <div className="user">{user.name}</div>
        </div>
  )
}

export default UserLogo
