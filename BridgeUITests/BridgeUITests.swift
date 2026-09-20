import XCTest

/// Drives the real, compiled Bridge app in the iOS Simulator through every screen and the
/// key two-partner turn-flip states, attaching a screenshot at each step. Run via
/// `xcodebuild test`; screenshots are extracted from the resulting .xcresult bundle in CI
/// (see `.github/workflows/screenshots.yml`) and uploaded as build artifacts.
///
/// Test methods are prefixed A/B/C/... only so they read in a sensible order in reports —
/// each one is independently self-sufficient (see `dismissLanguagePickerIfPresent`), since
/// XCTest doesn't guarantee execution order and CI may run them in parallel.
final class BridgeUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    private func attach(_ app: XCUIApplication, _ name: String) {
        let shot = app.screenshot()
        let attachment = XCTAttachment(screenshot: shot)
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    /// The language picker only ever appears once per fresh install. Since the simulator's
    /// app container can persist a language choice from an earlier test method in the same
    /// run, every test checks for it defensively instead of assuming a fixed test order.
    private func dismissLanguagePickerIfPresent(_ app: XCUIApplication) {
        let english = app.buttons["uitest.lang.en"]
        if english.waitForExistence(timeout: 3) {
            english.tap()
        }
    }

    private var anyCard: XCUIElement {
        XCUIApplication().buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'uitest.card.'")).firstMatch
    }

    /// Cards now live behind a dropdown sheet (one button per deck) rather than sitting
    /// directly on the room screen — see `CardGridView`. Tap this to open it before
    /// `anyCard` can be found.
    private var anyDeckButton: XCUIElement {
        XCUIApplication().buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'uitest.deck.'")).firstMatch
    }

    /// `waitForExistence` alone isn't enough right after a sheet dismiss (e.g. `swipeDown()`)
    /// — the element can exist in the hierarchy a beat before its dismiss animation finishes
    /// and it actually becomes tappable, which reads as "Not hittable" from `tap()`.
    private func waitUntilHittable(_ element: XCUIElement, timeout: TimeInterval = 10) -> Bool {
        let predicate = NSPredicate(format: "exists == true AND hittable == true")
        let expectation = XCTNSPredicateExpectation(predicate: predicate, object: element)
        return XCTWaiter().wait(for: [expectation], timeout: timeout) == .completed
    }

    // MARK: - A. Full interactive walkthrough: onboarding through Hall room's complete
    // two-partner turn cycle (both reveals, both rotations) — this is the one test that
    // demonstrates every onboarding screen and the flip mechanic through genuine taps
    // rather than a jump, matching what a real first-time couple would actually see.

    func testA_FullWalkthroughOnboardingAndHallRoom() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTesting"]
        app.launch()

        XCTAssertTrue(app.buttons["uitest.lang.en"].waitForExistence(timeout: 10))
        attach(app, "A01-language-picker")
        app.buttons["uitest.lang.en"].tap()

        XCTAssertTrue(app.buttons["uitest.welcome.begin"].waitForExistence(timeout: 10))
        attach(app, "A02-welcome")
        app.buttons["uitest.welcome.begin"].tap()

        XCTAssertTrue(app.buttons["uitest.onboarding.next"].waitForExistence(timeout: 10))
        attach(app, "A03-onboarding-what-is-bridge")
        app.buttons["uitest.onboarding.next"].tap()

        // Disclaimer now comes before the apology-ritual explanation, not after it — the
        // ritual/oath happen right away, ahead of the house map and names.
        XCTAssertTrue(app.buttons["uitest.disclaimer.continue"].waitForExistence(timeout: 10))
        attach(app, "A06-disclaimer")
        app.buttons["uitest.disclaimer.continue"].tap()

        XCTAssertTrue(app.buttons["uitest.onboarding.next"].waitForExistence(timeout: 10))
        attach(app, "A04-onboarding-apology")
        app.buttons["uitest.onboarding.next"].tap()

        XCTAssertTrue(app.buttons["uitest.ritual.line.0"].waitForExistence(timeout: 10))
        app.buttons["uitest.ritual.line.0"].tap()
        attach(app, "A18-ritual")
        app.buttons["uitest.ritual.continue"].tap()

        XCTAssertTrue(app.buttons["uitest.oath.ready"].waitForExistence(timeout: 10))
        attach(app, "A17-oath")
        app.buttons["uitest.oath.ready"].tap()

        XCTAssertTrue(app.buttons["uitest.housemap.continue"].waitForExistence(timeout: 10))
        attach(app, "A07-house-map")
        app.buttons["uitest.housemap.continue"].tap()

        XCTAssertTrue(app.textFields["uitest.names.partnerA"].waitForExistence(timeout: 10))
        app.textFields["uitest.names.partnerA"].tap()
        app.textFields["uitest.names.partnerA"].typeText("Alex")
        app.textFields["uitest.names.partnerB"].tap()
        app.textFields["uitest.names.partnerB"].typeText("Jordan")
        attach(app, "A08-names")
        app.buttons["uitest.names.continue"].tap()

        XCTAssertTrue(app.buttons["uitest.dice.roll"].waitForExistence(timeout: 10))
        attach(app, "A12-dice-before-roll")
        app.buttons["uitest.dice.roll"].tap()
        XCTAssertTrue(app.buttons["uitest.dice.continue"].waitForExistence(timeout: 10))
        attach(app, "A13-dice-after-roll")
        app.buttons["uitest.dice.continue"].tap()

        XCTAssertTrue(app.sliders["uitest.intensity.slider.partnerA"].waitForExistence(timeout: 10))
        app.sliders["uitest.intensity.slider.partnerA"].adjust(toNormalizedSliderPosition: 1.0)

        app.buttons["uitest.state.picker.partnerA"].tap()
        XCTAssertTrue(app.buttons["uitest.state.partnerA.hurt"].waitForExistence(timeout: 10))
        app.buttons["uitest.state.partnerA.hurt"].tap()
        app.buttons["uitest.state.picker.done"].tap()

        app.buttons["uitest.state.picker.partnerB"].tap()
        XCTAssertTrue(app.buttons["uitest.state.partnerB.confused"].waitForExistence(timeout: 10))
        app.buttons["uitest.state.partnerB.confused"].tap()
        app.buttons["uitest.state.picker.done"].tap()

        attach(app, "A14-intensity-and-state")
        app.buttons["uitest.intensity.continue"].tap()

        // High intensity on partner A triggers Calm Down.
        XCTAssertTrue(app.buttons["uitest.calmdown.start"].waitForExistence(timeout: 10))
        attach(app, "A15-calm-down-before")
        app.buttons["uitest.calmdown.start"].tap()
        XCTAssertTrue(app.buttons["uitest.calmdown.done"].waitForExistence(timeout: 10))
        attach(app, "A16-calm-down-breathing")
        app.buttons["uitest.calmdown.done"].tap()

        // Hall room — first partner's turn.
        XCTAssertTrue(anyDeckButton.waitForExistence(timeout: 10))
        attach(app, "A19-hall-room-partner-one-turn")
        anyDeckButton.tap()
        XCTAssertTrue(anyCard.waitForExistence(timeout: 10))
        anyCard.tap()
        app.buttons["uitest.room.done"].tap()

        // Reveal card appears rotated to face the second partner; the room behind it has
        // NOT rotated yet — this is the exact "before rotation" state.
        XCTAssertTrue(app.buttons["uitest.reveal.readit"].waitForExistence(timeout: 10))
        attach(app, "A20-hall-reveal-before-rotation")
        app.buttons["uitest.reveal.readit"].tap()

        // Only now does the room actually flip to face the second partner.
        XCTAssertTrue(anyDeckButton.waitForExistence(timeout: 10))
        attach(app, "A21-hall-room-after-rotation-partner-two-turn")
        anyDeckButton.tap()
        XCTAssertTrue(anyCard.waitForExistence(timeout: 10))
        anyCard.tap()
        app.buttons["uitest.room.done"].tap()

        // Second reveal, rotated back to face the first partner.
        XCTAssertTrue(app.buttons["uitest.reveal.readit"].waitForExistence(timeout: 10))
        attach(app, "A22-hall-reveal-second-before-rotation")
        app.buttons["uitest.reveal.readit"].tap()

        // Both partners have now answered — the walk advances to Living Room.
        XCTAssertTrue(anyDeckButton.waitForExistence(timeout: 10))
        attach(app, "A23-advanced-to-living-room")
    }

    // MARK: - B. Remaining sequential rooms, jumped to directly with a seeded first
    // answer + reveal already pending, so the flip mechanic is visible for each without
    // re-walking all of onboarding — still the real app/real view code rendering real state.

    private func jumpRoomWithReveal(_ key: String, prefix: String) throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTesting"]
        app.launchEnvironment = ["UITEST_JUMP_FLOW": key, "UITEST_JUMP_REVEAL": "1"]
        app.launch()
        dismissLanguagePickerIfPresent(app)

        XCTAssertTrue(app.buttons["uitest.reveal.readit"].waitForExistence(timeout: 10))
        attach(app, "\(prefix)-reveal-before-rotation")
        app.buttons["uitest.reveal.readit"].tap()

        XCTAssertTrue(anyDeckButton.waitForExistence(timeout: 10))
        attach(app, "\(prefix)-after-rotation")
    }

    func testB1_LivingRoom() throws { try jumpRoomWithReveal("livingRoom", prefix: "B1-living-room") }
    func testB2_Study() throws { try jumpRoomWithReveal("study", prefix: "B2-study") }
    func testB3_KidsRoom() throws { try jumpRoomWithReveal("kidsRoom", prefix: "B3-kids-room") }

    func testB4_Kitchen() throws {
        // Discussion mode (both partners visible at once) — no sequential reveal/rotation.
        let app = XCUIApplication()
        app.launchArguments = ["-uiTesting"]
        app.launchEnvironment = ["UITEST_JUMP_FLOW": "kitchen"]
        app.launch()
        dismissLanguagePickerIfPresent(app)

        XCTAssertTrue(app.buttons["uitest.room.done.partnerA"].waitForExistence(timeout: 10))
        attach(app, "B4-kitchen-discussion-mode")
    }

    // MARK: - C. Basement, Bridge finale, voice snapshot, closing

    func testC1_Basement() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTesting"]
        app.launchEnvironment = ["UITEST_JUMP_FLOW": "basement"]
        app.launch()
        dismissLanguagePickerIfPresent(app)

        XCTAssertTrue(anyDeckButton.waitForExistence(timeout: 10))
        attach(app, "C1-basement-asking")
    }

    func testC2_BridgeFinale() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTesting"]
        app.launchEnvironment = ["UITEST_JUMP_FLOW": "bridgeFinale"]
        app.launch()
        dismissLanguagePickerIfPresent(app)

        XCTAssertTrue(app.staticTexts["The Bridge"].waitForExistence(timeout: 10))
        attach(app, "C2-bridge-finale")
    }

    // Couple's Agreement now happens after the Bridge finale, once the couple has actually
    // done the conflict-repair work, rather than as a pre-session checklist.
    func testC2b_CouplesAgreement() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTesting"]
        app.launchEnvironment = ["UITEST_JUMP_FLOW": "couplesAgreementSetup"]
        app.launch()
        dismissLanguagePickerIfPresent(app)

        XCTAssertTrue(app.buttons["uitest.agreement.skip"].waitForExistence(timeout: 10))
        attach(app, "C2b-couples-agreement")
    }

    func testC3_VoiceSnapshot() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTesting"]
        app.launchEnvironment = ["UITEST_JUMP_FLOW": "voiceSnapshot"]
        app.launch()
        dismissLanguagePickerIfPresent(app)

        XCTAssertTrue(app.buttons["uitest.voice.save"].waitForExistence(timeout: 10))
        attach(app, "C3-voice-snapshot")
    }

    func testC4_Closing() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTesting"]
        app.launchEnvironment = ["UITEST_JUMP_FLOW": "closing"]
        app.launch()
        dismissLanguagePickerIfPresent(app)

        XCTAssertTrue(app.buttons["uitest.closing.save"].waitForExistence(timeout: 10))
        attach(app, "C4-closing-todays-mark")
    }

    // MARK: - D. Settings hub and every reachable sub-screen

    func testD_SettingsAndSubscreens() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTesting"]
        app.launch()
        dismissLanguagePickerIfPresent(app)

        XCTAssertTrue(app.buttons["uitest.settings.gear"].waitForExistence(timeout: 10))
        app.buttons["uitest.settings.gear"].tap()

        XCTAssertTrue(app.buttons["uitest.settings.relationships"].waitForExistence(timeout: 10))
        attach(app, "D01-settings-hub")

        app.buttons["uitest.settings.relationships"].tap()
        XCTAssertTrue(app.buttons["uitest.profile.row"].waitForExistence(timeout: 10))
        attach(app, "D02-profile-switcher")
        app.buttons["uitest.profile.done"].tap()

        XCTAssertTrue(waitUntilHittable(app.buttons["uitest.settings.viewpath"]))
        app.buttons["uitest.settings.viewpath"].tap()
        XCTAssertTrue(app.buttons["uitest.housemap.continue"].waitForExistence(timeout: 10))
        attach(app, "D03-house-map-from-settings")
        app.buttons["uitest.housemap.continue"].tap()

        XCTAssertTrue(app.buttons["uitest.settings.disclaimer"].waitForExistence(timeout: 10))
        app.buttons["uitest.settings.disclaimer"].tap()
        XCTAssertTrue(app.buttons["uitest.legal.done"].waitForExistence(timeout: 10))
        attach(app, "D04-disclaimer-from-settings")
        app.buttons["uitest.legal.done"].tap()

        XCTAssertTrue(app.buttons["uitest.settings.crisis"].waitForExistence(timeout: 10))
        app.buttons["uitest.settings.crisis"].tap()
        XCTAssertTrue(app.buttons["uitest.crisis.close"].waitForExistence(timeout: 10))
        attach(app, "D05-crisis-resources")
        app.buttons["uitest.crisis.close"].tap()

        XCTAssertTrue(app.buttons["uitest.settings.language"].waitForExistence(timeout: 10))
        app.buttons["uitest.settings.language"].tap()
        if app.buttons["English"].waitForExistence(timeout: 5) {
            attach(app, "D06-language-picker")
            app.buttons["English"].tap()
        }

        XCTAssertTrue(app.buttons["uitest.settings.privacy"].waitForExistence(timeout: 10))
        app.buttons["uitest.settings.privacy"].tap()
        XCTAssertTrue(app.buttons["uitest.legal.done"].waitForExistence(timeout: 10))
        attach(app, "D07-privacy-policy")
        app.buttons["uitest.legal.done"].tap()

        XCTAssertTrue(app.buttons["uitest.settings.terms"].waitForExistence(timeout: 10))
        app.buttons["uitest.settings.terms"].tap()
        XCTAssertTrue(app.buttons["uitest.legal.done"].waitForExistence(timeout: 10))
        attach(app, "D08-terms-of-use")
        app.buttons["uitest.legal.done"].tap()

        XCTAssertTrue(app.buttons["uitest.settings.done"].waitForExistence(timeout: 10))
        app.buttons["uitest.settings.done"].tap()
    }

    // MARK: - E. Paywall (forced by a profile that already used its free session)

    func testE_Paywall() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTesting"]
        app.launchEnvironment = ["UITEST_FORCE_PAYWALL": "1"]
        app.launch()
        dismissLanguagePickerIfPresent(app)

        XCTAssertTrue(app.buttons["uitest.welcome.begin"].waitForExistence(timeout: 10))
        app.buttons["uitest.welcome.begin"].tap()

        XCTAssertTrue(app.buttons["uitest.paywall.maybelater"].waitForExistence(timeout: 10))
        attach(app, "E01-paywall")
        app.buttons["uitest.paywall.maybelater"].tap()
    }
}
