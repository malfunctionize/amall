
set(_compiler_id_version_compute "
  /* __IBMCPP__ = VRP */
# define @PREFIX@COMPILER_VERSION_MAJOR @MACRO_DEC@(__IBMCPP__/100)
# define @PREFIX@COMPILER_VERSION_MINOR @MACRO_DEC@(__IBMCPP__/10 % 10)
# define @PREFIX@COMPILER_VERSION_PATCH @MACRO_DEC@(__IBMCPP__    % 10)")
