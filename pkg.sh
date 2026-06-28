APP="$1"

# Build the .pkg installer
productbuild --component "/Applications/$APP.app" "$APP.pkg"

# Output the sha256 checksum
sha256sum "$APP.pkg"

# Try to get the app bundle id; if fails, show an error and continue
BUNDLE_ID=$(osascript -e "try
    set appId to id of app \"$APP\"
    return appId
on error errMsg number errNum
    do shell script \"echo 'Could not get application \\\"$APP\\\" (error: \" & errNum & \")'\"
    return \"\"
end try")

if [ -n "$BUNDLE_ID" ]; then
    echo "Bundle ID: $BUNDLE_ID"
else
    echo "Warning: Could not get bundle ID for $APP"
fi

# Read the version string, error if it fails
VERSION=$(defaults read "/Applications/$APP.app/Contents/Info" CFBundleShortVersionString 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "Version: $VERSION"
else
    echo "Warning: Could not get version from /Applications/$APP.app/Contents/Info"
fi


ICON=$(defaults read "/Applications/$APP.app/Contents/Info" CFBundleIconFile)
ICON="${ICON%.icns}.icns"
cp "/Applications/$APP.app/Contents/Resources/$ICON" "./$APP.icns"
