import { Shield, Users, TrendingUp, CheckCircle } from 'lucide-react'

export default function LoginFormRight() {
  return (
    <div 
      className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
      }}
    >
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>
      
      <div className="relative z-10 max-w-lg text-white">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">SaansRH</h1>
          <p className="text-xl text-white/90">
            La solution complète pour la gestion de vos ressources humaines
          </p>
        </div>

        <div className="space-y-6 mt-12">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Gestion simplifiée</h3>
              <p className="text-white/80">
                Gérez efficacement vos salariés, leurs documents et leurs affectations
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Suivi en temps réel</h3>
              <p className="text-white/80">
                Suivez les performances, les formations et les évaluations de vos équipes
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Sécurisé et fiable</h3>
              <p className="text-white/80">
                Vos données sont protégées avec les meilleures pratiques de sécurité
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex items-center space-x-2 text-white/80">
            <CheckCircle size={20} />
            <span className="text-sm">8 modules complets de gestion RH</span>
          </div>
        </div>
      </div>
    </div>
  )
}

