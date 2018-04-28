const fs = require('fs')
const ejs = require('ejs')
const minifyHtml = require('html-minifier').minify
const minify_html_options = {
  caseSensitive: false,
  collapseBooleanAttributes: false,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: false,
  preserveLineBreaks: false,
  preventAttributesEscaping: false,
  quoteCharacter: '\"',
  removeComments: true,
  removeEmptyAttributes: true,
  sortAttributes: true,
  sortClassName: true,
}

/**
 *
 * @param {object} params
 * @param {string} params.path - absolute path to ejs file
 * @param {object} params.data - the data to render with
 * @returns {*}
 */
exports.render = async function(params) {
  const {path: templatePath, data} = params
  const template = await new Promise((resolve, reject) => {
    fs.readFile(templatePath, 'utf8', (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
  const main = {
    ...data,
    filename: templatePath,
  }
  
  const html = ejs.render(template, main, {
    cache: process.env.NODE_ENV !== 'development',
    filename: templatePath,
  })
  
  return minifyHtml(html, minify_html_options)
}