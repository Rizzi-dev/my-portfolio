import { LocaleProvider } from './i18n/locale'
import { ListView } from './list/ListView'
import { Mobile } from './mobile/Mobile'
import { Desktop } from './os/Desktop'
import { useHashRoute } from './os/useHashRoute'
import { useIsMobile } from './os/useIsMobile'
import { ThemeProvider } from './theme/theme'

function Root() {
  const [route, navigate] = useHashRoute()
  const isMobile = useIsMobile()
  let view
  if (route.view === 'list') view = <ListView onBack={() => navigate({ view: 'os', app: null })} />
  else if (isMobile) view = <Mobile app={route.app} navigate={navigate} />
  else view = <Desktop route={route} navigate={navigate} />
  return <div data-testid="rizzios-root">{view}</div>
}

function App() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </LocaleProvider>
  )
}

export default App
