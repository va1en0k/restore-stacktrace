/**
 * Trifacta Inc. Confidential
 *
 * Copyright 2015 Trifacta Inc.
 * All Rights Reserved.
 *
 * Any use of this material is subject to the Trifacta Inc., Source License located
 * in the file 'SOURCE_LICENSE.txt' which is part of this package.  All rights to
 * this material and any derivative works thereof are reserved by Trifacta Inc.
 */

var _ = require('lodash');

function restoreStacktrace(options) {
  var stacktrace = options.stacktrace;
  var sourceMaps = options.sourceMaps;

  var lines = stacktrace.split('\n');
  var result = '';

  lines.forEach(function(stackLine) {

    if (stackLine.trim().indexOf('at ') === 0) {
      var sourceUrl = stackLine.substring(
        stackLine.lastIndexOf('(') + 1,
        stackLine.lastIndexOf(')')
      );

      var bundleFile = sourceUrl.substring(
        sourceUrl.lastIndexOf('/') + 1,
        sourceUrl.lastIndexOf(':', sourceUrl.lastIndexOf(':') - 1)
      );

      var sourceLine = parseInt(sourceUrl.substring(
        sourceUrl.lastIndexOf(':', sourceUrl.lastIndexOf(':') - 1) + 1,
        sourceUrl.lastIndexOf(':')
      ));

      var column = parseInt(sourceUrl.substring(
        sourceUrl.lastIndexOf(':') + 1,
        sourceUrl.length
      ));

      var sourceMap = sourceMaps[bundleFile];

      var originalPosition = sourceMap.originalPositionFor({
        line: sourceLine,
        column: column
      });

      var source = originalPosition.source.substring('webpack:///'.length, originalPosition.source.length);

      // remove last ? part
      if (source.lastIndexOf('?') > source.lastIndexOf('/')) {
        source = source.substring(0, source.lastIndexOf('?'));
      }

      result += '  at ';
      result += originalPosition.name;
      result += ' (' + source + ':' + originalPosition.line + ':' + originalPosition.column + ')';
    } else {
      result += stackLine;
    }

    result += '\n';
  });

  return result;
}

module.exports = restoreStacktrace;