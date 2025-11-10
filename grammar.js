// MIT License
// A minimal, robust S-expression grammar tailored for MeTTa-style code.
// Features:
// - Line comments starting with ';' to EOL
// - Strings (double-quoted, common escapes), numbers (int/float), symbols, and $variables
// - List nodes with `head` and repeated `argument` fields for ergonomic queries
// - Error tolerance for unbalanced lists while typing

module.exports = grammar({
  name: 'metta',

  extras: $ => [
    $.comment,
    /\s/
  ],

  // Keep it simple; MeTTa is largely S-expression based.
  rules: {
    source_file: $ => repeat($._expr),

    _expr: $ => choice(
      $.list,
      $.atom
    ),

	list: $ => choice(
	  seq("(", ")"), // empty list
	  seq(
		field("open", "("),
		field("head", $._expr),                // first element = head
		repeat(field("argument", $._expr)),    // rest = arguments
		field("close", ")")
	  )
	),

    atom: $ => choice(
      $.variable,
      $.number,
      $.string,
      $.symbol
    ),

    // Symbols = bare identifiers (exclude whitespace, parens, quotes, semicolon)
    symbol: _ => /[^()\s";][^()\s";]*/,

    // Variables start with $
    variable: _ => /\$[^()\s";]+/,

    // Simplistic number token: 123, -3.14, .5, 2.
    number: _ => token(seq(
      optional('-'),
      choice(
        /\d+\.\d*/,
        /\.\d+/,
        /\d+/
      )
    )),

    // Double-quoted strings with basic escapes
    string: _ => token(seq(
      '"',
      repeat(choice(
        /[^"\\\n\r]/,
        /\\./
      )),
      '"'
    )),

    // ; comment to EOL
    comment: _ => token(seq(';', /[^\n\r]*/))
  }
});
