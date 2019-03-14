const iriSource = `
  <svg
    height='120'
    width='120'
    xmlns='http://www.w3.org/2000/svg'
    >
    <defs>
      <linearGradient id='MyGradient'>
        <stop
          offset='5%'
          stop-color='green'
        ></stop>
        <stop
          offset='95%'
          stop-color='gold'
        ></stop>
      </linearGradient>
    </defs>
    <rect
      fill='url(#MyGradient)'
      height='100'
      width='100'
      x='10'
      y='10'
    ></rect>
  </svg>
`

export default iriSource
