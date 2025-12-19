import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { GraduationCap, Users, ArrowRight } from 'lucide-react'

export default function FormationHome() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isRH = user?.profil === 'compte_rh'

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 
          className="text-xl md:text-2xl font-bold flex items-center space-x-2"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          <GraduationCap size={22} style={{ color: '#2F5FD7' }} />
          <span>Formations</span>
        </h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Gérez vos formations et celles de vos salariés</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Mes formations */}
        <div 
          onClick={() => navigate('/formation/mes-formations')}
          className="card border-2 border-blue-200 bg-blue-50/30 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#EBF4FF' }}>
                  <GraduationCap size={24} style={{ color: '#2F5FD7' }} />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Mes formations</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Consultez vos formations en cours, suivez votre progression et accédez à votre historique
              </p>
              <div className="flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform" style={{ color: '#2F5FD7' }}>
                <span>Accéder</span>
                <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Formations salariés (RH seulement) */}
        {isRH && (
          <div 
            onClick={() => navigate('/formation/formations-salaries')}
            className="card border-2 border-purple-200 bg-purple-50/30 hover:border-purple-400 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <Users size={24} className="text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Formations salariés</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Gérez les formations de tous les salariés, validez ou rejetez-les avec motif, et assignez des directions
                </p>
                <div className="flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform text-purple-600">
                  <span>Accéder</span>
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

