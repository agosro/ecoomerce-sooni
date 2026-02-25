import { Wallet } from '@mercadopago/sdk-react'

/**
 * Componente Wallet de Mercado Pago
 * 
 * Este componente muestra el botón de pago de Mercado Pago en tu página.
 * 
 * NOTA: Tu aplicación actualmente REDIRIGE a initPoint en lugar de usar este componente.
 * Este es un ejemplo de cómo USARLO si lo necesitas en el futuro.
 * 
 * Props:
 * - preferenceId: ID de la preferencia obtenida del backend
 * - onError: callback si hay error
 * - onSubmit: callback cuando se completa el pago (aún se redirige)
 */
export default function MercadoPagoWallet({ preferenceId, onError, onSubmit }) {
  if (!preferenceId) {
    return <p className="text-stone-500 italic">Cargando opciones de pago...</p>
  }

  return (
    <div className="my-6">
      <Wallet
        initialization={{
          preferenceId: preferenceId,
        }}
        onError={onError}
        onSubmit={onSubmit}
      />
    </div>
  )
}

/**
 * NOTA IMPORTANTE
 * ================
 * Tu flujo actual es:
 * 1. Backend crea preferencia → retorna initPoint
 * 2. Frontend redirige a initPoint: window.location.href = payment.initPoint
 * 
 * Este componente Wallet es ALTERNATIVO:
 * - Muestra el botón EN TU PÁGINA
 * - El usuario hace click en el botón
 * - Se abre un modal o redirige a Mercado Pago
 * 
 * Ambos enfoques funcionan. El tuyo es más simple y directo.
 */
