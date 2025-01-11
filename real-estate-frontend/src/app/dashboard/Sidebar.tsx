import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, Users, CheckSquare, DollarSign, PlusSquare, LogOut, Settings } from 'lucide-react'

type SidebarProps = {
  userRole: 'ADMIN' | 'VERIFIER' | 'USER' | null
  setActiveView: (view: string) => void
}

export default function Sidebar({ userRole, setActiveView }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { name: 'My Properties', icon: Home, view: 'myProperties', roles: ['ADMIN', 'VERIFIER', 'USER'] },
    { name: 'Add Property', icon: PlusSquare, view: 'addProperty', roles: ['ADMIN', 'VERIFIER', 'USER'] },
    { name: 'User Management', icon: Users, view: 'userManagement', roles: ['ADMIN'] },
    { name: 'Verify Properties', icon: CheckSquare, view: 'verifyProperties', roles: ['ADMIN', 'VERIFIER'] },
    { name: 'Withdrawals', icon: DollarSign, view: 'withdrawals', roles: ['ADMIN', 'VERIFIER', 'USER'] },
    { name: 'Commission Settings', icon: Settings, view: 'commissionSettings', roles: ['ADMIN'] },
  ]

  return (
    <motion.div
      className={`bg-gray-900 h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      } transition-all duration-300 ease-in-out`}
      animate={{ width: isCollapsed ? 80 : 256 }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4">
          {!isCollapsed && (
            <h2 className="text-xl font-semibold text-purple-400">Web3 Estate</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="py-4">
            {menuItems
              .filter((item) => item.roles.includes(userRole as string))
              .map((item) => (
                <li key={item.name} className="px-4 py-2">
                  <motion.div
                    className={`flex items-center space-x-4 p-2 rounded-md 
                      text-gray-400 hover:bg-gray-800 hover:text-white
                      transition-colors duration-200 cursor-pointer`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView(item.view)}
                  >
                    <item.icon className="h-6 w-6" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </motion.div>
                </li>
              ))}
          </ul>
        </nav>
        <div className="p-4">
          <motion.button
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="h-6 w-6" />
            {!isCollapsed && <span>Logout</span>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

