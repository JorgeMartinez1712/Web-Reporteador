import { useLocation, useNavigate } from 'react-router-dom'

const PagoFallidoPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const paymentInfo = location.state?.paymentInfo ?? location.state ?? {}
  const params = new URLSearchParams(location.search)
  const orderNumber = paymentInfo.orderNumber ?? params.get('orderNumber') ?? params.get('order') ?? '---'
  const referenceNumber = paymentInfo.referenceNumber ?? params.get('referenceNumber') ?? params.get('reference') ?? '---'
  const message = paymentInfo.message ?? params.get('message') ?? 'El pago no se pudo procesar.'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-red-100 p-10 text-center space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 text-3xl">
            <i className="bi bi-x-circle" />
          </span>
          <h1 className="text-2xl font-semibold text-oscuro">Pago fallido</h1>
          <p className="text-sm text-oscuro">{message}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-6 text-left space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-red-500">Número de orden</p>
            <p className="text-lg font-semibold text-oscuro">{orderNumber}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-red-500">Número de referencia</p>
            <p className="text-lg font-semibold text-oscuro">{referenceNumber}</p>
          </div>
        </div>
        <button
          type="button"
          className="w-full py-3 rounded-2xl bg-oscuro text-white font-semibold tracking-wide hover:bg-hover transition"
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

export default PagoFallidoPage