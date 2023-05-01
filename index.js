const Dalsh = require('dalsh')
const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
const fs = require('fs')
class Amall {
  async clone(name, url) {
    const dir = path.join(process.cwd(), name)
    await git.clone({ fs, http, dir, url })
  }
  async make(name, platform) {
    let dalsh = new Dalsh()
    const cmake_path = path.resolve(__dirname, "bin", "cmake-3.26.3-macos-universal", "CMake.app", "Contents", "bin", "cmake")
    const repository_path = path.join(process.cwd(), name)

    const commands = [{
      message: "mkdir build",
      path: repository_path
    }, {
      message: `${cmake_path} ..`,
      path: path.resolve(repository_path, "build"),
    }, {
      message: `${cmake_path} --build . --config Release`,
      path: path.resolve(repository_path, "build"),
    }]

    for(let command of commands) {
      console.log("\n\n### running", command)
      await dalsh.request(command, (stream) => {
        process.stdout.write(stream.data)
      })
    }
  }
}

(async () => {
  const a = new Amall()
  await a.clone("llama", "https://github.com/ggerganov/llama.cpp")
  await a.make("llama", "mac")
})();
