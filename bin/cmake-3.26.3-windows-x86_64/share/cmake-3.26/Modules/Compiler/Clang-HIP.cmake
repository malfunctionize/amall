include(Compiler/Clang)
__compiler_clang(HIP)
__compiler_clang_cxx_standards(HIP)

set(_CMAKE_COMPILE_AS_HIP_FLAG "-x hip")
set(_CMAKE_HIP_RDC_FLAG "-fgpu-rdc")

if(NOT "x${CMAKE_HIP_SIMULATE_ID}" STREQUAL "xMSVC")
  set(CMAKE_HIP_COMPILE_OPTIONS_VISIBILITY_INLINES_HIDDEN "-fvisibility-inlines-hidden")

  string(APPEND CMAKE_HIP_FLAGS_DEBUG_INIT " -O")
endif()

set(CMAKE_HIP_RUNTIME_LIBRARY_DEFAULT "SHARED")
set(CMAKE_HIP_RUNTIME_LIBRARY_LINK_OPTIONS_STATIC  "")
set(CMAKE_HIP_RUNTIME_LIBRARY_LINK_OPTIONS_SHARED  "")

# Populated by CMakeHIPInformation.cmake
set(CMAKE_HIP_RUNTIME_LIBRARIES_STATIC "")
set(CMAKE_HIP_RUNTIME_LIBRARIES_SHARED "")
