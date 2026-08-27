```mermaid
graph TD
    N0["../cache/ast-cache"]
    N1["../cache/dependencies-cache"]
    N2["../cache/output-cache"]
    N3["../cache/signature-cache"]
    N4["../constants.js"]
    N5["../core/consolidation"]
    N6["../core/git"]
    N7["../core/language-detection"]
    N8["../core/scanner"]
    N9["../core/signature-formatter"]
    N10["../core/symbol-classifier"]
    N11["../core/symbols"]
    N12["../drift/index"]
    N13["../generator/adr-linker"]
    N14["../generator/change-report"]
    N15["../generator/dependency-graph"]
    N16["../generator/index"]
    N17["../generator/system-metadata"]
    N18["../index/index"]
    N19["../logging/index"]
    N20["../parsers/dependencies"]
    N21["../parsers/json-yaml"]
    N22["../parsers/python"]
    N23["../parsers/ts-js"]
    N24["../parsers/types"]
    N25["../types.js"]
    N26["../validator/index"]
    N27["./adr-linker"]
    N28["./cache/ast-cache"]
    N29["./cache/dependencies-cache"]
    N30["./cache/output-cache"]
    N31["./cache/signature-cache"]
    N32["./cli/init.js"]
    N33["./cli/update.js"]
    N34["./constants.js"]
    N35["./core/async"]
    N36["./core/consolidation"]
    N37["./core/git"]
    N38["./core/scanner"]
    N39["./drift/index"]
    N40["./generator/change-report"]
    N41["./generator/dependency-graph"]
    N42["./generator/index"]
    N43["./index/index"]
    N44["./init.js"]
    N45["./language-detection"]
    N46["./mcp/server.js"]
    N47["./mcp/types.js"]
    N48["./module-doc"]
    N49["./parsers/dependencies"]
    N50["./parsers/json-yaml"]
    N51["./parsers/python"]
    N52["./parsers/ts-js"]
    N53["./parsers/types"]
    N54["./resources/docs.js"]
    N55["./signature-matching"]
    N56["./status"]
    N57["./symbols"]
    N58["./tools/drift.js"]
    N59["./tools/impact.js"]
    N60["./tools/scan.js"]
    N61["./tools/validate.js"]
    N62["./types"]
    N63["./types.js"]
    N64["./ui/commands-provider"]
    N65["./ui/status-bar"]
    N66["./update.js"]
    N67["./validator/index"]
    N68["./validator/status"]
    N69["_jest/globals"]
    N70["_modelcontextprotocol/sdk/server"]
    N71["_modelcontextprotocol/sdk/server/stdio.js"]
    N72["_modelcontextprotocol/sdk/types.js"]
    N73["child_process"]
    N74["commander"]
    N75["crypto"]
    N76["demo/src/calculator.ts"]
    N77["demo/src/user-service.ts"]
    N78["fs"]
    N79["ignore"]
    N80["mcp/src/resources/docs.ts"]
    N81["mcp/src/server.ts"]
    N82["mcp/src/tools/drift.ts"]
    N83["mcp/src/tools/impact.ts"]
    N84["mcp/src/tools/scan.ts"]
    N85["mcp/src/tools/validate.ts"]
    N86["node_child_process"]
    N87["node_fs"]
    N88["node_fs/promises"]
    N89["node_path"]
    N90["node_readline"]
    N91["node_url"]
    N92["node_util"]
    N93["os"]
    N94["packages/doc-system-agent/src/cli/index.ts"]
    N95["packages/doc-system-agent/src/cli/init.ts"]
    N96["packages/doc-system-agent/src/cli/update.ts"]
    N97["packages/doc-system-agent/src/index.ts"]
    N98["packages/doc-system-agent/src/mcp/resources/docs.ts"]
    N99["packages/doc-system-agent/src/mcp/server.ts"]
    N100["packages/doc-system-agent/src/mcp/tools/drift.ts"]
    N101["packages/doc-system-agent/src/mcp/tools/impact.ts"]
    N102["packages/doc-system-agent/src/mcp/tools/scan.ts"]
    N103["packages/doc-system-agent/src/mcp/tools/validate.ts"]
    N104["path"]
    N105["src/__tests__/adr-linker.test.ts"]
    N106["src/__tests__/determinism.test.ts"]
    N107["src/__tests__/parser-symbol-types.test.ts"]
    N108["src/__tests__/setup.ts"]
    N109["src/__tests__/signature-formatter.test.ts"]
    N110["src/__tests__/snapshot-doc-generation.test.ts"]
    N111["src/__tests__/symbol-classifier.test.ts"]
    N112["src/cache/ast-cache.ts"]
    N113["src/cache/dependencies-cache.ts"]
    N114["src/cache/output-cache.ts"]
    N115["src/cache/signature-cache.ts"]
    N116["src/cli/generate-cli.ts"]
    N117["src/cli/scan-cli.ts"]
    N118["src/cli/validate-cli.ts"]
    N119["src/core/consolidation.ts"]
    N120["src/core/git.ts"]
    N121["src/core/scanner.ts"]
    N122["src/core/signature-formatter.ts"]
    N123["src/core/symbol-classifier.ts"]
    N124["src/core/symbols.ts"]
    N125["src/drift/index.ts"]
    N126["src/extension.ts"]
    N127["src/generator/adr-linker.ts"]
    N128["src/generator/dependency-graph.ts"]
    N129["src/generator/index.ts"]
    N130["src/generator/module-doc.ts"]
    N131["src/generator/system-metadata.ts"]
    N132["src/index/index.ts"]
    N133["src/parsers/dependencies.ts"]
    N134["src/parsers/json-yaml.ts"]
    N135["src/parsers/python.ts"]
    N136["src/parsers/ts-js.ts"]
    N137["src/ui/commands-provider.ts"]
    N138["src/ui/status-bar.ts"]
    N139["src/validator/index.ts"]
    N140["src/validator/signature-matching.ts"]
    N141["tree-sitter"]
    N142["tree-sitter-python"]
    N143["ts-morph"]
    N144["vscode"]
    N145["yaml"]

    N100 --> N25
    N100 --> N86
    N100 --> N88
    N100 --> N89
    N100 --> N92
    N101 --> N25
    N101 --> N87
    N101 --> N89
    N101 --> N90
    N102 --> N25
    N102 --> N86
    N102 --> N92
    N103 --> N25
    N103 --> N86
    N103 --> N92
    N105 --> N104
    N105 --> N13
    N105 --> N78
    N105 --> N93
    N106 --> N104
    N106 --> N11
    N106 --> N16
    N106 --> N18
    N106 --> N20
    N106 --> N23
    N106 --> N78
    N106 --> N8
    N106 --> N93
    N107 --> N21
    N107 --> N23
    N107 --> N9
    N108 --> N69
    N109 --> N24
    N109 --> N9
    N110 --> N104
    N110 --> N16
    N110 --> N18
    N110 --> N23
    N110 --> N24
    N110 --> N5
    N110 --> N78
    N110 --> N93
    N111 --> N10
    N111 --> N24
    N112 --> N104
    N112 --> N75
    N112 --> N78
    N113 --> N104
    N113 --> N78
    N114 --> N104
    N114 --> N75
    N114 --> N78
    N115 --> N104
    N115 --> N78
    N116 --> N0
    N116 --> N1
    N116 --> N104
    N116 --> N12
    N116 --> N14
    N116 --> N15
    N116 --> N16
    N116 --> N17
    N116 --> N18
    N116 --> N2
    N116 --> N20
    N116 --> N21
    N116 --> N22
    N116 --> N23
    N116 --> N24
    N116 --> N3
    N116 --> N5
    N116 --> N6
    N116 --> N78
    N116 --> N8
    N117 --> N104
    N117 --> N21
    N117 --> N22
    N117 --> N23
    N117 --> N24
    N117 --> N78
    N117 --> N8
    N118 --> N104
    N118 --> N18
    N118 --> N21
    N118 --> N22
    N118 --> N23
    N118 --> N24
    N118 --> N26
    N118 --> N78
    N118 --> N8
    N119 --> N1
    N119 --> N20
    N119 --> N24
    N119 --> N57
    N120 --> N73
    N121 --> N19
    N121 --> N45
    N121 --> N79
    N121 --> N87
    N121 --> N89
    N122 --> N24
    N123 --> N24
    N124 --> N24
    N124 --> N75
    N125 --> N11
    N125 --> N24
    N125 --> N3
    N126 --> N104
    N126 --> N144
    N126 --> N28
    N126 --> N29
    N126 --> N30
    N126 --> N31
    N126 --> N35
    N126 --> N36
    N126 --> N37
    N126 --> N38
    N126 --> N39
    N126 --> N40
    N126 --> N41
    N126 --> N42
    N126 --> N43
    N126 --> N49
    N126 --> N50
    N126 --> N51
    N126 --> N52
    N126 --> N53
    N126 --> N64
    N126 --> N65
    N126 --> N67
    N126 --> N68
    N126 --> N78
    N127 --> N87
    N127 --> N89
    N128 --> N20
    N129 --> N24
    N129 --> N27
    N129 --> N48
    N129 --> N87
    N129 --> N89
    N130 --> N10
    N130 --> N24
    N130 --> N27
    N130 --> N9
    N131 --> N104
    N131 --> N75
    N131 --> N78
    N132 --> N1
    N132 --> N104
    N132 --> N11
    N132 --> N24
    N132 --> N7
    N132 --> N78
    N133 --> N143
    N134 --> N104
    N134 --> N145
    N134 --> N62
    N135 --> N104
    N135 --> N141
    N135 --> N142
    N135 --> N62
    N136 --> N104
    N136 --> N143
    N136 --> N62
    N137 --> N144
    N138 --> N144
    N139 --> N104
    N139 --> N19
    N139 --> N24
    N139 --> N55
    N139 --> N56
    N139 --> N78
    N140 --> N10
    N140 --> N24
    N140 --> N9
    N76 --> N62
    N77 --> N62
    N80 --> N88
    N80 --> N89
    N81 --> N54
    N81 --> N58
    N81 --> N59
    N81 --> N60
    N81 --> N61
    N81 --> N70
    N81 --> N71
    N81 --> N72
    N82 --> N86
    N82 --> N88
    N82 --> N89
    N82 --> N92
    N83 --> N87
    N83 --> N89
    N83 --> N90
    N84 --> N86
    N84 --> N92
    N85 --> N86
    N85 --> N92
    N94 --> N4
    N94 --> N44
    N94 --> N66
    N94 --> N74
    N95 --> N4
    N95 --> N88
    N95 --> N89
    N95 --> N91
    N96 --> N4
    N96 --> N88
    N96 --> N89
    N96 --> N91
    N97 --> N32
    N97 --> N33
    N97 --> N34
    N97 --> N46
    N97 --> N47
    N98 --> N88
    N98 --> N89
    N99 --> N54
    N99 --> N58
    N99 --> N59
    N99 --> N60
    N99 --> N61
    N99 --> N63
    N99 --> N70
    N99 --> N71
    N99 --> N72
```