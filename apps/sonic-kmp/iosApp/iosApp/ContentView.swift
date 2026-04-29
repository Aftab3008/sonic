import UIKit
import SwiftUI
import ComposeApp

struct ComposeView: UIViewControllerRepresentable {
    var onStateLoaded: (Bool) -> Void

    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController(onStateLoaded: { ready in
            onStateLoaded(ready)
        })
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}

struct ContentView: View {
    @State private var isReady = false

    var body: some View {
        ZStack {
            if isReady {
                ComposeView(onStateLoaded: { ready in
                    isReady = ready
                })
                .ignoresSafeArea()
            } else {
                Color("LaunchScreenBackground")
                    .ignoresSafeArea()
                
                Image("splash_logo")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 200, height: 200)
                
                // Keep a hidden ComposeView to start initialization
                ComposeView(onStateLoaded: { ready in
                    isReady = ready
                })
                .frame(width: 0, height: 0)
                .opacity(0)
            }
        }
    }
}



