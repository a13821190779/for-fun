import r from '../utils/raf';
const { raf, clraf } = r;

class ani {
    constructor(el) {
        this.el = typeof el == 'string' ? document.querySelector(el) : el;
        this.style = this.el.style;
    }

    setMode(k, end) {
        let v;
        // transform dir
        let td = null;
        switch (true) {
            case /(left|translateX)/.test(k):
                k = 'transform';
                v = 'translateX';
                td = 1;
                break;
            case /right/.test(k):
                k = 'transform';
                v = 'translateX';
                td = -1;
                break;
            case /(top|translateY)/.test(k):
                k = 'transform';
                v = 'translateY';
                td = 1;
                break;
            case /bottom/.test(k):
                k = 'transform';
                v = 'translateY';
                td = -1;
                break;
            case /(height|width)/.test(k):
                v = k;
                end = end < 0 ? 0 : end;
                break;
            case /rotate/.test(k):
                v = k;
                k = 'transform';
                break;
            case /scale/.test(k):
                console.log('正则');
                v = k;
                k = 'transform';
                break;
            default:
                break;
        }
        this.k = k;
        this.v = v;
        this.td = td;
        return end;
    }

    // 获取只读
    getStyle() {
        return (
            this.el.style[this.k] ||
            (this.el.currentStyle
                ? this.el.currentStyle[this.k]
                : window.getComputedStyle(this.el, false)[this.k])
        );
    }

    // 设置css
    setStyle(v) {
        switch (true) {
            case /(translateX|translateY)/.test(this.v):
                v = v * this.td;
                v = `${this.v}(${v * this.td}px)`;
                break;
            case /rotate/.test(this.v):
                v = `${this.v}(${v}deg)`;
                break;
            case /height|width/.test(this.v):
                v = `${v}px`;
                break;
            case /scale|scaleX|scaleY/.test(this.v):
                v = `${this.v}(${v})`;
                break;
            default:
                break;
        }
        return (this.style[this.k] = v);
    }

    // 获取number
    getNumber(value) {
        const patt = new RegExp('-?[\\d\\.]', 'g');
        const res =
            typeof value === 'number'
                ? String(value).match(patt)
                : value.match(patt);
        return res !== null ? +res.join('') : 0;
    }

    // launch
    ani(attr, end) {
        end = this.getNumber(end);
        end = this.setMode(attr, end);
		// 转化和缓存
        console.log(this.k);
        console.log(this.v);
        const style = this.getStyle(this.k);
		console.log(style);
		if (this.k === 'transform') {
            const matrix = style.match(/\(.+\)/g)[0].slice(1, -1).split(',')
            
        // https://fanmingfei.com/posts/CSS3_Transform_Matrix_Intro.html 这个很全面
		// http://www.cnblogs.com/shibaxiong/p/4673035.html 这个网站获取角度
		// 张鑫旭 http://www.zhangxinxu.com/wordpress/2012/06/css3-transform-matrix-%E7%9F%A9%E9%98%B5/
            // 根据公式来算
            // transform: matrix(1, 0, 0, 1, 30, 30); /* a=1, b=0, c=0, d=1, e=30, f=30 */
            // 其中，x, y表示转换元素的  !!所有!!  坐标（变量）
            // translateX: ax + cy + e
            // translateY: bx + dy + f
            // scaleX: sx
            // scaleY: sy
            // rotateX: x * cosθ - y * sinθ
            // rotateY: x * sinθ + y * cosθ
			// skewX: tan(c)
			// skewY: tan(b)
		}
        const start = this.getNumber(style);
        this.td !== null && (end *= this.td);
        // 增加还是减少
        this.inOrde = end - start > 0 ? 1 : -1;
        if (/(auto|none)/.test(this.getStyle(this.k))) {
            this.setStyle(0);
        }
        this.innerAni(this.k, start, end);
    }

    // 动画速度轨迹
    innerAni(attr, start, end) {
        let i = start;
        const fn = () => {
            i += 0.01 * this.inOrde;
            this.setStyle(i);

            // if (this.inOrde > 0) {
            //     if (this.getNumber(this.getStyle(this.k)) < end) {
            //         raf(fn);
            //     }
            // } else {
            //     if (this.getNumber(this.getStyle(this.k)) > end) {
            //         raf(fn);
            //     }
            // }
        };
        raf(fn);
    }

    fn() {}
}

const o = new ani('.box');
o.ani('left', '2');
