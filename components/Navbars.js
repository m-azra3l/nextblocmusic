<nav>        
<ul><li><span onClick={() => { setNav(true) }} className="active">
    <IconContext.Provider value={{ color: 'white' }}>
        <FaHome />
    </IconContext.Provider>
</span></li></ul>
<ul><li><span onClick={() => { setNav(false) }}>
    <IconContext.Provider value={{ color: 'white' }}>
        <FaBookmark />    
    </IconContext.Provider> 
</span></li></ul>
<ul><li><span onClick={() => { setNav(false) }}>
    <IconContext.Provider value={{ color: 'white' }}>
        <FaPlusCircle />    
    </IconContext.Provider>    
</span></li></ul>
<ul><li><span onClick={() => { setNav(false) }}>
    <IconContext.Provider value={{ color: 'white' }}>
        <FaUser />    
    </IconContext.Provider>    
</span></li></ul>
<ul><li><span onClick={() => { setNav(false) }}>
    <IconContext.Provider value={{ color: 'white' }}>
        <FaCartPlus />    
    </IconContext.Provider>    
</span></li></ul> 
</nav>