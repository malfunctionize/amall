const Dalsh = require('dalsh')
const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
const decompress = require('decompress');
const os = require("os")
const fs = require('fs')
const fetch = require('cross-fetch')
class Amall {
  constructor() {
    this.arch = os.arch()
    this.platform = os.platform()
    if (this.platform === "darwin") {
      // mac
      this.cmake_path = path.resolve(__dirname, "bin", "cmake-3.26.3-macos-universal", "CMake.app", "Contents", "bin", "cmake")
      this.cmake_url = "https://github.com/Kitware/CMake/releases/download/v3.26.3/cmake-3.26.3-macos-universal.tar.gz"
    } else if (this.platform === "win32") {
      if (this.arch === "x64") {
        this.cmake_path = path.resolve(__dirname, "bin", "cmake-3.26.3-windows-x86_64", "bin", "cmake.exe")
        this.cmake_url = "https://github.com/Kitware/CMake/releases/download/v3.26.3/cmake-3.26.3-windows-x86_64.zip"
      } else if (this.arch === "arm64") {
        this.cmake_path = path.resolve(__dirname, "bin", "cmake-3.26.3-windows-arm64", "bin", "cmake.exe")
        this.cmake_url = "https://github.com/Kitware/CMake/releases/download/v3.26.3/cmake-3.26.3-windows-arm64.zip"
      }
    } else {
      if (this.arch === "x64") {
        this.cmake_path = path.resolve(__dirname, "bin", "cmake-3.26.3-linux-x86_64", "bin", "cmake")
        this.cmake_url = "https://github.com/Kitware/CMake/releases/download/v3.26.3/cmake-3.26.3-linux-x86_64.tar.gz"
      } else if (this.arch === "arm64") {
        this.cmake_path = path.resolve(__dirname, "bin", "cmake-3.26.3-linux-aarch64", "bin", "cmake")
        this.cmake_url = "https://github.com/Kitware/CMake/releases/download/v3.26.3/cmake-3.26.3-linux-aarch64.tar.gz"
      }
    }
  }
  async install () {
    const url_chunks = this.cmake_url.split("/")
    const filename = url_chunks[url_chunks.length-1]
    const filename_without_extension = filename.replace(/(\.tar\.gz|\.zip)/, "")
    const bin_folder = path.resolve(__dirname, "bin")
    const dist = path.resolve(bin_folder, filename)
    const response = await fetch(this.cmake_url);
    await fs.promises.mkdir(bin_folder, { recursive: true }).catch((e) => { })
    const fileStream = fs.createWriteStream(dist)
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on("error", (err) => {
        reject(err);
      });
      fileStream.on("finish", function() {
        resolve();
      });
    });
    
//    const unzipped_path = path.resolve(bin_folder, filename_without_extension)
    await decompress(dist, bin_folder)

  }
  async clone(name, url) {
    const dir = path.join(process.cwd(), name)
    await git.clone({ fs, http, dir, url })
  }
  async make(name, platform) {
    let dalsh = new Dalsh()
    const repository_path = path.join(process.cwd(), name)

    const commands = [{
      message: "mkdir build",
      path: repository_path
    }, {
      message: `${this.cmake_path} ..`,
      path: path.resolve(repository_path, "build"),
    }, {
      message: `${this.cmake_path} --build . --config Release`,
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
  await a.install()
  await a.clone("llama", "https://github.com/ggerganov/llama.cpp")
  await a.make("llama", "mac")
})();
