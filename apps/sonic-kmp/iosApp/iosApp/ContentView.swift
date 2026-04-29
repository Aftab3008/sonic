import UIKit
import SwiftUI
import ComposeApp

struct ComposeView: UIViewControllerRepresentable {
    var onStateLoaded: (Bool) -> Void

    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController(onStateLoaded: { ready in
            onStateLoaded(ready as! Bool)
        })
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}

struct ContentView: View {
    @State private var isReady = false

    var body: some View {
        ZStack {
            ComposeView(onStateLoaded: { ready in
                withAnimation(.easeInOut(duration: 0.5)) {
                    isReady = ready as! Bool
                }
            })
            .ignoresSafeArea()
            .opacity(isReady ? 1 : 0)

            if !isReady {
                ZStack {
                    Color("LaunchScreenBackground")
                        .ignoresSafeArea()
                    
                    Image("splash_logo")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 180, height: 180)
                }
                .transition(.opacity)
                .zIndex(1)
            }
        }
    }
}



