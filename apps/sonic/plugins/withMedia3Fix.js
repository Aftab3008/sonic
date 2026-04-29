const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const file = path.join(
        config.modRequest.projectRoot,
        "android",
        "build.gradle",
      );
      let contents = fs.readFileSync(file, "utf-8");

      if (!contents.includes("MEDIA3_FIX_START")) {
        const fix = `
                        // MEDIA3_FIX_START
                        allprojects {
                            configurations.all {
                                resolutionStrategy.eachDependency { details ->
                                    if (details.requested.group.startsWith('com.github.MissingCore')) {
                                        details.useTarget "androidx.media3:\${details.requested.name}:1.9.3"
                                    } else if (details.requested.group == 'androidx.media3') {
                                        details.useVersion "1.9.3"
                                    }
                                }
                            }   
                        }
                        // MEDIA3_FIX_END
                    `;
        contents = fix + "\n" + contents;
        fs.writeFileSync(file, contents);
      }
      return config;
    },
  ]);
};
