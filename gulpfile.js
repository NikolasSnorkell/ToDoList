

let project_folder ="project";
let source_folder ="#src";

let fs = require("fs");

let path = {
    build:{
        html:project_folder+"/",
        css:project_folder+"/css/",
        js:project_folder+"/js/",
        img:project_folder+"/img/",
        fonts:project_folder+"/fonts/",
    },
    src:{
        html:[source_folder+"/*.html","!"+source_folder+"/_*.html",],
        css:source_folder+"/scss/style.scss",
        js:source_folder+"/js/**/*",
        jq:source_folder+"/js/jquery-3.6.0.min.js",
        img:source_folder+"/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts:source_folder+"/fonts/*.ttf",
    },
    watch:{
        html:source_folder+"/**/*.html",
        css:source_folder+"/scss/**/*.scss",
        js:source_folder+"/js/**/*.js",
        img:source_folder+"/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean:"./"+project_folder +"/"
}


let {src,dest} = require("gulp"),
gulp = require("gulp"),
browsersync = require("browser-sync").create(),
fileinclude = require("gulp-file-include"),
del = require("del"),
scss = require("gulp-sass")(require('sass')),
autoprefixer = require("gulp-autoprefixer"),
group_media = require("gulp-group-css-media-queries"),
clean_css = require("gulp-clean-css"),
rename = require("gulp-rename"),
uglify = require("gulp-uglify-es").default,
imagemin = require("gulp-imagemin"),
ttf2woff = require("gulp-ttf2woff"),
ttf2woff2 = require("gulp-ttf2woff2"),
fonter = require("gulp-fonter");



function browserSync(params){
    browsersync.init({
        server:{
            baseDir:"./"+project_folder +"/"
        },
        port:3000,
        browser: 'chrome',
        notify:false
    })
}




function html(){
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css(){
    return src(path.src.css)
        .pipe(
            scss({ 
                outputStyle: 'expanded' 
            }).on('error', scss.logError)
        )
        .pipe(group_media())
        .pipe(autoprefixer({
            overrideBrowserlist:["last 5 versions"],
            cascade:true
        }))
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(rename({
            extname:".min.css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js(){
   src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        // .pipe(uglify())
        // .pipe(rename({
        //     extname:".min.js"
        // }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
    return src(path.src.jq)
        .pipe(dest(path.build.js));   
}





function images(){
    return src(path.src.img)
        // .pipe(imagemin({
        //     proggressive:true,
        //     svgoPlugins:[{removeViewBox: false}],
        //     interlaced: true,
        //     optimiztionLevel: 3
        // }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}


function fonts(){
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}





gulp.task("otf2ttf",function(){
    return gulp.src([source_folder+"/fonts/*.otf"])
    .pipe(fonter({
        formats:["ttf"]
    }))
    .pipe(dest(source_folder+"/fonts/"));
})





function watchFiles(){
    gulp.watch([path.watch.html],html);
    gulp.watch([path.watch.css],css);
    gulp.watch([path.watch.js],js);
    gulp.watch([path.watch.img],images);
}

function clean(){
    return del(path.clean);
}





let build = gulp.series(clean,gulp.parallel(js,css,html,images,fonts));
let watch = gulp.parallel(build,watchFiles,browserSync);



exports.html = html;
exports.fonts = fonts;
exports.images = images;
exports.css = css;
exports.js =js;
exports.watch = watch;
exports.build = build;
exports.default = watch;