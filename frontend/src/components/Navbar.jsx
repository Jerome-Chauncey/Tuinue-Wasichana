import { NavLink } from "react-router-dom"

function Taskbar({ user }) {
  return (
    <nav className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">GiveAid</div>

      <div className="flex space-x-4">
        <NavLink to="/" className="hover:text-yellow-300">Home</NavLink>
        <NavLink to="/stories" className="hover:text-yellow-300">Stories</NavLink>
        <NavLink to="/donate" className="hover:text-yellow-300">Donate</NavLink>

        {!user && (
          <>
            <NavLink to="/login" className="hover:text-yellow-300">Login</NavLink>
            <NavLink to="/donorsignup" className="hover:text-yellow-300">Sign Up</NavLink>
          </>
        )}

        {user?.role === "admin" && (
          <NavLink to="/admindashboard" className="hover:text-yellow-300">Admin Dashboard</NavLink>
        )}

        {user?.role === "donor" && (
          <NavLink to="/donordashboard" className="hover:text-yellow-300">My Dashboard</NavLink>
        )}

        {user?.role === "charity" && (
          <NavLink to="/charitydashboard" className="hover:text-yellow-300">Charity Dashboard</NavLink>
        )}

        {user && (
          <button className="hover:text-red-400" onClick={user.logout}>Logout</button>
        )}
      </div>
    </nav>
  )
}

export default Taskbar
