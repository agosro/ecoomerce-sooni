import { STATUS_LABEL } from '../../utils/orderStatus'
import { STATUS_ICON, STATUS_ICON_COLOR } from './orderStatusData.jsx'

export default function OrderStatusTimeline({ statusHistory }) {
  if (!statusHistory?.length) return null

  return (
    <div>
      <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-4">
        Seguimiento
      </p>
      <ol className="relative space-y-0">
        {statusHistory.map((entry, i) => {
          const isLast = i === statusHistory.length - 1
          return (
            <li key={i} className="flex gap-3.5">
              {/* Conector vertical + círculo de estado */}
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${STATUS_ICON_COLOR[entry.status] || 'bg-stone-100 text-stone-400'}`}>
                  {STATUS_ICON[entry.status]}
                </div>
                {!isLast && <div className="w-px flex-1 bg-stone-100 my-1" />}
              </div>

              {/* Texto */}
              <div className="pb-4">
                <p className="text-sm font-medium text-ink leading-tight">
                  {STATUS_LABEL[entry.status] || entry.status}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {new Date(entry.changedAt).toLocaleDateString('es-AR', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  })}{' '}
                  · {new Date(entry.changedAt).toLocaleTimeString('es-AR', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
