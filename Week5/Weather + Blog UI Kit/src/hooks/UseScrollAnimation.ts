import { useEffect, useRef, useState } from "react"

interface UseScrollAnimationProps {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
}

function useScrollAnimation (props: UseScrollAnimationProps) {
    const [isInView, setIsInView] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const {threshold = 0.1, rootMargin = "0px", triggerOnce = true} = props

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    if (triggerOnce) observer.unobserve(element)
                } else if (!triggerOnce) {
                    setIsInView(false)
                }
            },
            {
                rootMargin,
                threshold
            }
        )
        observer.observe(element)
        return () => observer.unobserve(element)
    }, [threshold, rootMargin, triggerOnce])

    return {ref, isInView}
}

export { useScrollAnimation }