import SwiftUI
import UIKit

/// Draws a room's illustration, or a plain warm beige fallback if the asset hasn't been
/// dropped into Assets.xcassets yet — per spec: "images can be dropped in later without
/// blocking the build."
struct RoomBackgroundImage: View {
    let imageName: String

    private static let fallbackBeige = Color(red: 0.96, green: 0.92, blue: 0.85)

    var body: some View {
        GeometryReader { geometry in
            if UIImage(named: imageName) != nil {
                Image(imageName)
                    .resizable()
                    .scaledToFill()
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .clipped()
            } else {
                Self.fallbackBeige
                    .frame(width: geometry.size.width, height: geometry.size.height)
            }
        }
        .ignoresSafeArea()
    }
}
