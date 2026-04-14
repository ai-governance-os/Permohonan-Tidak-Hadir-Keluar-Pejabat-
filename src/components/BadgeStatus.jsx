const warna = {
  menunggu: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  maklum: 'bg-green-100 text-green-700 border-green-200',
}

const label = {
  menunggu: 'Menunggu',
  maklum: 'Maklum',
}

export default function BadgeStatus({ status }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${warna[status] || 'bg-slate-100 text-slate-600'}`}>
      {label[status] || status}
    </span>
  )
}
