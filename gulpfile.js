'use strict';

// Компоненты
let FS = require('fs');
let Path = require('path');
let Del = require('del');
let MergeStream = require('merge-stream');
let Gulp = require('gulp');
let GTwig = require('gulp-twig');
let GSass = require('gulp-sass');
let GImagemin = require('gulp-imagemin');
let GRename = require('gulp-rename');
let GSassVariables = require('gulp-sass-variables');

var realFavicon = require ('gulp-real-favicon');
var FAVICON_DATA_FILE = 'faviconData.json';

// Переменные
/**
 * Символьный тип текущей среды (production|development)
 * @type {string}
 */
const NODE_ENV = process.argv.indexOf('-p') > 0 ? 'production' : 'development';
/**
 * Уровень оптимизации изображений
 * @type {number}
 */
const IMAGE_OPTIMIZATION_LEVEL = 3;
/**
 * Использовать метод оптимизации - Progressive
 * @type {boolean}
 */
const IMAGE_OPTIMIZATION_PROGRESSIVE = true;
/**
 * Использовать метод оптимизации - Interlaced
 * @type {boolean}
 */
const IMAGE_OPTIMIZATION_INTERLACED = true;
/**
 * Карта используемых имен директорий
 * @type {Object.<string, string>}
 */
const DIR_NAME_MAP = {
    BOWER: 'bower_components',
    FONT_AWESOME: 'font-awesome',
    ANGULAR: 'angular',
    VENDOR: 'vendor',
    SRC: 'src',
    DATA: 'data',
    APP: 'app',
    ASSETS: 'assets',
    IMAGES: 'images',
    FONTS: 'fonts',
    JS: 'js',
    CSS: 'css',
    MODULES: 'components',
};
/**
 * Карта путей
 * @type {Object.<string, string>}
 */
const PATH_MAP = {
    ROOT: Path.resolve(__dirname),
    SRC: Path.resolve(DIR_NAME_MAP.SRC),
    APP: Path.resolve(DIR_NAME_MAP.APP),
    BOWER: Path.resolve(DIR_NAME_MAP.BOWER),
};

// Генерируем дополнительные пути
PATH_MAP.ASSETS = Path.join(PATH_MAP.APP, DIR_NAME_MAP.ASSETS);
PATH_MAP.IMAGES = Path.join(PATH_MAP.ASSETS, DIR_NAME_MAP.IMAGES);
PATH_MAP.FONTS = Path.join(PATH_MAP.ASSETS, DIR_NAME_MAP.FONTS);

/**
 * Карта используемых файлов и их псевдонимов
 * @type {Object.<string, string[]>}
 */
const FILE_MAP = {
    TWIG_DATA: ['twig.json', '', ''],
    MAIN_STYLE: ['main.scss', 'app.css', PATH_MAP.ASSETS],
    MAIN_SCRIPT: ['main.js', 'app.js', PATH_MAP.ASSETS],
    MAIN_TEMPLATE: ['main.twig', 'index.html', PATH_MAP.ROOT],
    DATA: [
        [
            Path.join(PATH_MAP.SRC, DIR_NAME_MAP.DATA, 'links.json'),
            Path.join(DIR_NAME_MAP.SRC, DIR_NAME_MAP.DATA),
            Path.join(PATH_MAP.ASSETS, DIR_NAME_MAP.DATA),
        ]
    ],
    CSS: [
        [
            Path.join(PATH_MAP.BOWER, DIR_NAME_MAP.ANGULAR, 'angular-csp.css'),
            Path.join(DIR_NAME_MAP.BOWER),
            Path.join(PATH_MAP.ASSETS, DIR_NAME_MAP.VENDOR),
        ]
    ],
    JS: [
        [
            Path.join(PATH_MAP.BOWER, DIR_NAME_MAP.ANGULAR, 'angular.min.js'),
            Path.join(DIR_NAME_MAP.BOWER),
            Path.join(PATH_MAP.ASSETS, DIR_NAME_MAP.VENDOR),
        ],
        [
            Path.join(PATH_MAP.SRC, DIR_NAME_MAP.MODULES, '**', '**', '**', '*.js'),
            Path.join(DIR_NAME_MAP.SRC, DIR_NAME_MAP.MODULES),
            Path.join(PATH_MAP.ASSETS)
        ]
    ],
    IMAGES: [
        [
            Path.join(PATH_MAP.SRC, DIR_NAME_MAP.MODULES, '**', DIR_NAME_MAP.IMAGES, '**', '*'),
            Path.join(DIR_NAME_MAP.SRC, DIR_NAME_MAP.MODULES, '**'),
            PATH_MAP.IMAGES
        ]
    ],
    FONTS: [
        [
            Path.join(PATH_MAP.SRC, DIR_NAME_MAP.MODULES, '**', DIR_NAME_MAP.FONTS, '**', '*'),
            Path.join(DIR_NAME_MAP.SRC, DIR_NAME_MAP.MODULES, '**'),
            PATH_MAP.FONTS
        ],
        [
            Path.join(PATH_MAP.BOWER, DIR_NAME_MAP.FONT_AWESOME, DIR_NAME_MAP.FONTS, '*'),
            Path.join(DIR_NAME_MAP.BOWER),
            Path.join(PATH_MAP.ASSETS, DIR_NAME_MAP.VENDOR),
        ]
    ]
};

/**
 * Получение данных для twig шаблона
 * @returns {{data}}
 */
function getTwigData()
{
    // Загружаем данные для шаблонизатора
    let data = JSON.parse(FS.readFileSync(Path.join(PATH_MAP.SRC, DIR_NAME_MAP.DATA, FILE_MAP.TWIG_DATA[0])));

    // Устанавливаем дополнительные переменные среды
    data.env.env = NODE_ENV;
    data.env.path.assets = Path.join(DIR_NAME_MAP.APP, DIR_NAME_MAP.ASSETS);

    return {
        'data': data
    };
}

Gulp
    // Удаление всех подготовленных файлов приложения
    .task('clean', function() {
        return Del([PATH_MAP.APP]);
    });
    // Компиляция шаблона
Gulp
    .task(
        'compile-template',
        function ()
        {
            return Gulp
                .src(Path.join(PATH_MAP.SRC, FILE_MAP.MAIN_TEMPLATE[0]))
                .pipe(GTwig(getTwigData()))
                .pipe(GRename(FILE_MAP.MAIN_TEMPLATE[1]))
                .pipe(Gulp.dest(FILE_MAP.MAIN_TEMPLATE[2]));
        }
    );
    // Компиляция стилей
Gulp
    .task(
        'compile-style',
        function ()
        {
            return Gulp
                .src(Path.join(PATH_MAP.SRC, FILE_MAP.MAIN_STYLE[0]))
                .pipe(GSassVariables({
                    $env: NODE_ENV
                }))
                .pipe(GSass().on('error', GSass.logError))
                .pipe(GRename(FILE_MAP.MAIN_STYLE[1]))
                .pipe(Gulp.dest(FILE_MAP.MAIN_STYLE[2]));
        }
    );
    // Компиляция скриптов
Gulp
    .task(
        'compile-script',
        function ()
        {
            return Gulp
                .src(Path.join(PATH_MAP.SRC, FILE_MAP.MAIN_SCRIPT[0]))
                .pipe(GRename(FILE_MAP.MAIN_SCRIPT[1]))
                .pipe(Gulp.dest(FILE_MAP.MAIN_SCRIPT[2]));
        }
    );
    // Копирования данных
Gulp
    .task(
        'copy-data',
        function()
        {
            let stream = MergeStream();

            FILE_MAP.DATA.forEach(function(fileMap) {
                stream.add(
                    Gulp
                        .src(fileMap[0], { base: fileMap[1] })
                        .pipe(Gulp.dest(fileMap[2]))
                );
            });

            return stream;
        }
    );
    // Копирования стилей
Gulp
    .task(
        'copy-css',
        function()
        {
            let stream = MergeStream();

            FILE_MAP.CSS.forEach(function(fileMap) {
                stream.add(
                    Gulp
                        .src(fileMap[0], { base: fileMap[1] })
                        .pipe(Gulp.dest(fileMap[2]))
                );
            });

            return stream;
        }
    );
Gulp
    // Копирования скриптов
    .task(
        'copy-js',
        function()
        {
            let stream = MergeStream();

            FILE_MAP.JS.forEach(function(fileMap) {
                stream.add(
                    Gulp
                        .src(fileMap[0], { base: fileMap[1] })
                        .pipe(Gulp.dest(fileMap[2]))
                );
            });

            return stream;
        }
    );
Gulp
    // Копирования изображений
    .task(
        'copy-images',
        function()
        {
            let stream = MergeStream();

            FILE_MAP.IMAGES.forEach(function(fileMap) {
                stream.add(
                    Gulp
                        .src(fileMap[0], { base: fileMap[1] })
                        .pipe(GImagemin({
                            optimizationLevel: IMAGE_OPTIMIZATION_LEVEL,
                            progressive: IMAGE_OPTIMIZATION_PROGRESSIVE,
                            interlaced: IMAGE_OPTIMIZATION_INTERLACED
                        }))
                        .pipe(Gulp.dest(fileMap[2]))
                );
            });

            return stream;
        }
    );
Gulp
    // Копирования шрифтов
    .task(
        'copy-fonts',
        function()
        {
            let stream = MergeStream();

            FILE_MAP.FONTS.forEach(function(fileMap) {
                stream.add(
                    Gulp
                        .src(fileMap[0], { base: fileMap[1] })
                        .pipe(Gulp.dest(fileMap[2]))
                );
            });

            return stream;
        }
    );

// Отслеживание изменений файлов приложения
Gulp
    .task(
        'watch',
        function ()
        {
            Gulp.watch(Path.join(PATH_MAP.SRC, '**', '*.js'), ['compile-script']);
            Gulp.watch(Path.join(PATH_MAP.SRC, '**', '*.scss'), ['compile-style']);
            Gulp.watch(Path.join(PATH_MAP.SRC, '**', '*.twig'), ['compile-template']);
        }
    );

Gulp
    .task('generate-favicon', function(done) {
        realFavicon.generateFavicon({
            masterPicture: 'src/data/faviconMaster.png', // TODO: to var
            dest: Path.resolve(__dirname) , // TODO: to var
            iconsPath: '/', // TODO: to var
            design: {
                ios: {
                    pictureAspect: 'noChange',
                    assets: {
                        ios6AndPriorIcons: false,
                        ios7AndLaterIcons: false,
                        precomposedIcons: false,
                        declareOnlyDefaultIcon: true
                    }
                },
                desktopBrowser: {},
                windows: {
                    pictureAspect: 'noChange',
                    backgroundColor: '#9f00a7',
                    onConflict: 'override',
                    assets: {
                        windows80Ie10Tile: false,
                        windows10Ie11EdgeTiles: {
                            small: false,
                            medium: true,
                            big: false,
                            rectangle: false
                        }
                    }
                },
                androidChrome: {
                    pictureAspect: 'noChange',
                    themeColor: '#ffffff',
                    manifest: {
                        display: 'standalone',
                        orientation: 'notSet',
                        onConflict: 'override',
                        declared: true
                    },
                    assets: {
                        legacyIcon: false,
                        lowResolutionIcons: false
                    }
                },
                safariPinnedTab: {
                    pictureAspect: 'blackAndWhite',
                    threshold: 43.75,
                    themeColor: '#5bbad5'
                }
            },
            settings: {
                scalingAlgorithm: 'Mitchell',
                errorOnImageTooSmall: false,
                readmeFile: false,
                htmlCodeFile: false,
                usePathAsIs: false
            },
            markupFile: FAVICON_DATA_FILE
        }, function() {
            done();
        });
    });

Gulp
    .task('check-for-favicon-update', function(done) {
        var currentVersion = JSON.parse(FS.readFileSync(FAVICON_DATA_FILE)).version;
        realFavicon.checkForUpdates(currentVersion, function(err) {
            if (err) {
                throw err;
            }
        });
    });


// Копирование файлов приложения
Gulp
    .task(
        'copy',
        Gulp.series(
            'copy-data',
            'copy-js',
            'copy-css',
            'copy-images',
            'copy-fonts',
        )
    );

// Компиляция приложения
Gulp
    .task(
        'compile',
        Gulp.series(
            'compile-template',
            'compile-style',
            'compile-script',
        )
    );

// Команда по умолчанию
Gulp
    .task(
        'default',
        Gulp.series(
            'clean',
            'copy',
            'compile',
            'generate-favicon'
        )
    );
