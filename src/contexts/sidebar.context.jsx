import React, {createContext, useEffect, useState} from 'react'

export const SidebarContext = createContext();

const SidebarProvider = ({children}) => {

    const [isToggleSidebar, setIsToggleSidebar] = useState(false);

    // useEffect(()=>{
    //     alert(isToggleSidebar)
    // },[isToggleSidebar])

  return (
    <SidebarContext.Provider value={{isToggleSidebar, setIsToggleSidebar}}>{children}</SidebarContext.Provider>
  )
}

export default SidebarProvider
