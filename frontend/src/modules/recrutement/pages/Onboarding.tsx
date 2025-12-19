import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useState } from 'react'

const onboardingSteps = [
  { id: 1, label: 'Accueil et présentation', completed: false },
  { id: 2, label: 'Formation aux outils', completed: false },
  { id: 3, label: 'Intégration équipe', completed: false },
  { id: 4, label: 'Documentation', completed: false },
  { id: 5, label: 'Évaluation initiale', completed: false },
]

export default function Onboarding() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [steps, setSteps] = useState(onboardingSteps)

  const { data: candidature } = useQuery({
    queryKey: ['candidature', id],
    queryFn: async () => {
      const response = await api.get(`/api/recrutement/candidatures/${id}`)
      return response.data
    },
  })

  const mutation = useMutation({
    mutationFn: async (stepId: number) => {
      const response = await api.post(`/api/recrutement/candidatures/${id}/onboarding`, {
        stepId,
      })
      return response.data
    },
    onSuccess: (data) => {
      setSteps(steps.map(s => s.id === data.stepId ? { ...s, completed: true } : s))
      toast.success('Étape complétée')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur')
    },
  })

  const toggleStep = (stepId: number) => {
    const step = steps.find(s => s.id === stepId)
    if (step && !step.completed) {
      mutation.mutate(stepId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/recrutement/candidatures')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Onboarding digital</h1>
          <p className="text-gray-600 mt-2">
            {candidature?.prenom} {candidature?.nom}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Processus d'intégration</h2>
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${
                step.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-primary-300'
              } cursor-pointer transition-colors`}
              onClick={() => toggleStep(step.id)}
            >
              {step.completed ? (
                <CheckCircle className="text-green-600" size={24} />
              ) : (
                <Circle className="text-gray-400" size={24} />
              )}
              <div className="flex-1">
                <p className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-800'}`}>
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-gray-600">Progression</p>
          <p className="text-3xl font-bold text-primary-700">
            {steps.filter(s => s.completed).length}/{steps.length}
          </p>
        </div>
      </div>
    </div>
  )
}

