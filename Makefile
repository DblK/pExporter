#######################################################################
#   Playlist Exporter
#   Copyright (C) 2013, Rémy Boulanouar
#
#   javascript compilation / "minification" makefile
#
#   MODULE -- js files to minify
#   BUILD  -- js minified target file (1)
#
#######################################################################

# Fix MAKE for Windows Problem
ifdef SystemRoot
  SHELL=C:/Windows/System32/cmd.exe
  CMDSEP= &
  MKDIR=mkdir
else
  CMDSEP= ;
  MKDIR=mkdir -p
endif

# GOOGLE CLOSURE COMPILER
GCC_VERSION = 2338
GCC_PATH = tools/closure-compiler/
GCC_COMPRESSOR = ${GCC_PATH}compiler$(GCC_VERSION).jar
GCC_OPTION = --compilation_level SIMPLE_OPTIMIZATIONS
#GCC_OPTION = --compilation_level ADVANCED_OPTIMIZATIONS

# BUILDCRX COMPILER
ifdef SystemRoot
  CRX_PATH = tools/buildcrx/windows/
  CRX_EXE = buildcrx-v1.0.exe
else
  CRX_PATH = tools/buildcrx/linux/
  CRX_EXE = buildcrx-v1.0
endif

# Set the source directory
srcdir = src
buildir = build
docdir = docs
chromedir = $(buildir)

# CURRENT BUILD VERSION
ME_VER=$(shell cat $(srcdir)/version | sed "s/^.*[^0-9]\([0-9]*\.[0-9]*\.[0-9]*\).*/\1/")
VERSION=sed "s/@VERSION/${ME_VER}/"
VERSFILE=sed "s/@VERSFILE/${ME_VER}/"
VERSFILEMIN=sed "s/@VERSFILE/${ME_VER}-min/"

# list of module to compile
MODULE = $(srcdir)/core.js

# list of dependances
DEPENDS = $(srcdir)/pExport.css\
         README.md\
         LICENSE\
         $(srcdir)/background.js\
         $(srcdir)/options.html\
         $(srcdir)/options.js

# Debug Target name
DEBUGCH = $(chromedir)/pExport-$(ME_VER).js

# Build Target name
BUILDCH = $(chromedir)/pExport-$(ME_VER)-min.js

#######################################################################

.DEFAULT_GOAL := all

all: clean chromebuild

debug: chromedebug

clean: chromeclean
	rm -f $(buildir)/CHANGELOG
	rm -f $(buildir)/README.md
	rm -f $(buildir)/LICENSE

chromedebug:chromeclean chrometree
	cat $(MODULE) >> $(DEBUGCH)
	cat $(srcdir)/manifest.json | $(VERSFILE) | $(VERSION) > $(chromedir)/manifest.json
	cat $(srcdir)/pExport.js | $(VERSFILE) > $(chromedir)/pExport.js
	cp $(srcdir)/img/* $(chromedir)/img
	cp $(srcdir)/icon48.png $(chromedir)
	cp $(srcdir)/icon128.png $(chromedir)
	$(foreach file,$(DEPENDS), cp $(file) $(chromedir) $(CMDSEP))

chromebuild: chromedebug chromebuildmin
	cp CHANGELOG $(buildir)
	cp README $(buildir)

chromebuildmin:
	cat $(srcdir)/manifest.json | $(VERSFILEMIN) | $(VERSION) > $(chromedir)/manifest.json
	cat $(srcdir)/pExport.js | $(VERSFILEMIN) > $(chromedir)/pExport.js
	java -jar $(GCC_COMPRESSOR) $(GCC_OPTION) --js=$(DEBUGCH) --js_output_file=$(BUILDCH)
	rm -f $(DEBUGCH)

chrometree:
	$(MKDIR) "$(chromedir)/img"
	$(MKDIR) "$(chromedir)/_locales"
	cp -R $(srcdir)/_locales/* $(chromedir)/_locales

chromeclean:
	rm -Rf $(chromedir)/*
	rm -f $(buildir)/pExport-*.crx

#######################################################################