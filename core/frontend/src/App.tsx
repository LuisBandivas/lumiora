import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { steps, stepIndex, type JourneyStep } from './app/journey'
import { AppFooter } from './components/layout/AppFooter'
import { AppHeader } from './components/layout/AppHeader'
import { StepIndicator } from './components/layout/StepIndicator'
import { CaptureScreen } from './features/camera/CaptureScreen'
import { usePhotoSession } from './features/camera/usePhotoSession'
import { CustomizeScreen } from './features/editor/CustomizeScreen'
import { useEditSettings } from './features/editor/useEditSettings'
import { ChooseLook } from './features/templates/ChooseLook'
import { useTemplateSelection } from './features/templates/useTemplateSelection'
import { ReviewScreen } from './features/editor/ReviewScreen'
import { ExportScreen } from './features/export/ExportScreen'

function App() {
  const [step, setStep] = useState<JourneyStep>('select')
  const selection = useTemplateSelection()
  const photos = usePhotoSession(selection.template)
  const edits = useEditSettings()

  // A new step starts at the top; otherwise it opens at the previous screen's scroll offset.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  const index = stepIndex(step)
  const go =(delta: number) => setStep(steps[index + delta].id)

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        <AppHeader onHome={() => setStep('select')} />
        <StepIndicator current={step} onNavigate={setStep} />
        {/* overflow-x-clip, not hidden: hidden makes main a scroll container and breaks sticky bars. */}
        <main className="flex flex-1 flex-col overflow-x-clip">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              className="flex flex-1 flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {step === 'select' ? (
                <ChooseLook selection={selection} onContinue={() => go(1)} />
              ) : step === 'source' ? (
                <CaptureScreen
                  template={selection.template}
                  session={photos}
                  onBack={() => go(-1)}
                  onContinue={() => go(1)}
                />
              ) : step === 'customize' ? (
                <CustomizeScreen
                  template={selection.template}
                  photos={photos}
                  edits={edits}
                  onBack={() => go(-1)}
                  onContinue={() => go(1)}
                />
              ) : step === 'review' ? (
                <ReviewScreen
                  template={selection.template}
                  photos={photos}
                  edits={edits}
                  onEdit={() => go(-1)}
                  onContinue={() => go(1)}
                />
              ) : (
                <ExportScreen
                  template={selection.template}
                  photos={photos}
                  edits={edits}
                  onBack={() => go(-1)}
                  onStartOver={() => {
                    photos.clearAll()
                    edits.reset()
                    setStep('select')
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        <AppFooter />
      </div>
    </MotionConfig>
  )
}

export default App
